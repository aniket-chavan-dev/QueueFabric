import os
import signal
import subprocess
import sys
import time

processes = []


def shutdown(signum=None, frame=None):
    print("\nStopping Django and worker...")

    for process in processes:
        if process.poll() is None:
            process.terminate()

    for process in processes:
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()

    sys.exit(0)


signal.signal(signal.SIGINT, shutdown)
signal.signal(signal.SIGTERM, shutdown)


worker = subprocess.Popen([
    "python",
    "manage.py",
    "worker",
])
processes.append(worker)


server = subprocess.Popen([
    "gunicorn",
    "server.wsgi:application",
    "--bind",
    f"0.0.0.0:{os.environ.get('PORT', '8000')}",
])
processes.append(server)

print("Django server started")
print("Queue worker started")


try:
    while True:
        if worker.poll() is not None:
            print("Worker stopped.")
            shutdown()

        if server.poll() is not None:
            print("Django server stopped.")
            shutdown()

        time.sleep(2)

except (KeyboardInterrupt, SystemExit):
    shutdown()