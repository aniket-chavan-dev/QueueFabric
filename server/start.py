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

    print("\nStopping Django and worker...", flush=True)

    processes = [worker, server]

    for process in processes:
        if process is not None and process.poll() is None:
            try:
                process.terminate()
            except ProcessLookupError:
                pass

    deadline = time.time() + 10

    for process in processes:
        if process is not None and process.poll() is None:
            remaining = max(0, deadline - time.time())

            try:
                process.wait(timeout=remaining)
            except subprocess.TimeoutExpired:
                try:
                    process.kill()
                except ProcessLookupError:
                    pass

    print("Shutdown complete.", flush=True)
    sys.exit(0)


signal.signal(signal.SIGINT, shutdown)
signal.signal(signal.SIGTERM, shutdown)


port = os.environ.get("PORT", "8000")


print("Starting QueueFabric worker...", flush=True)

worker = subprocess.Popen([
    sys.executable,
    "manage.py",
    "worker",
])


print("Starting Django/Gunicorn...", flush=True)

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

        # Django/Gunicorn died
        if server.poll() is not None:
            print(
                f"Gunicorn stopped with exit code {server.returncode}",
                flush=True
            )

            # If Django dies, the web service is useless,
            # so stop the whole service.
            shutdown()

        # Worker died
        if worker.poll() is not None:
            print(
                f"Worker stopped with exit code {worker.returncode}",
                flush=True
            )

            # Restart worker instead of killing Django.
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