import subprocess
import sys
import signal


processes = []


def shutdown(signum=None, frame=None):
    print("\nStopping Django and worker...")

    for process in processes:
        if process.poll() is None:
            process.terminate()

    sys.exit(0)


signal.signal(signal.SIGINT, shutdown)
signal.signal(signal.SIGTERM, shutdown)


worker = subprocess.Popen([
    "uv", "run", "manage.py", "worker"
])

processes.append(worker)

server = subprocess.Popen([
    "uv", "run", "manage.py", "runserver"
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

except KeyboardInterrupt:
    shutdown()