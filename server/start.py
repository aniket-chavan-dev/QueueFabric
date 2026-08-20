import os
import signal
import subprocess
import sys
import time


worker = None
server = None
shutting_down = False


def shutdown(signum=None, frame=None):
    global shutting_down

    if shutting_down:
        return

    shutting_down = True

    print("Stopping Django and worker...", flush=True)

    for process in (worker, server):
        if process is not None and process.poll() is None:
            try:
                process.terminate()
            except ProcessLookupError:
                pass

    # Give children time to exit
    for process in (worker, server):
        if process is not None:
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                try:
                    process.kill()
                except ProcessLookupError:
                    pass

    print("Shutdown complete.", flush=True)


signal.signal(signal.SIGTERM, shutdown)
signal.signal(signal.SIGINT, shutdown)


port = os.environ.get("PORT", "8000")


print("Starting queue worker...", flush=True)

worker = subprocess.Popen([
    sys.executable,
    "manage.py",
    "worker",
])


print("Starting Django...", flush=True)

server = subprocess.Popen([
    "gunicorn",
    "config.wsgi:application",
    "--bind",
    f"0.0.0.0:{port}",
])


print("Django server started", flush=True)
print("Queue worker started", flush=True)


try:
    while True:

        # If Gunicorn stops, stop the service.
        if server.poll() is not None:
            print(
                f"Gunicorn stopped: {server.returncode}",
                flush=True
            )
            shutdown()
            sys.exit(1)

        # If worker stops, restart only the worker.
        if worker.poll() is not None:
            print(
                f"Worker stopped: {worker.returncode}",
                flush=True
            )

            print("Restarting worker...", flush=True)

            worker = subprocess.Popen([
                sys.executable,
                "manage.py",
                "worker",
            ])

            print("Worker restarted.", flush=True)

        time.sleep(2)

except KeyboardInterrupt:
    shutdown()