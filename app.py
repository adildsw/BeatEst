import os
import argparse
import webbrowser
from time import time

from flask import Flask, render_template, request

app = Flask(__name__, static_folder="web", template_folder="web")

BPM = 120

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/getBPM")
def get_bpm():
    return str(BPM)

@app.route("/saveResult", methods=["POST"])
def save_result():
    raw = request.form["raw"]
    data = request.form["data"]
    name = request.form["name"]
    ip = request.remote_addr
    
    raw = raw.replace("[", "")
    raw = raw.replace("]", "")
    data = data.replace("[", "")
    data = data.replace("]", "")

    timestamp = str(int(round(time() * 1000)))

    if not os.path.exists("data"):
        os.makedirs("data")

    with open(os.path.join("data", "{}_{}_{}_{}.csv".format(timestamp, name, ip, BPM)), "w") as f:
        f.write(data)
    with open(os.path.join("data", "{}_{}_{}_{}_RAW.csv".format(timestamp, name, ip, BPM)), "w") as f:
        f.write(raw)
    
    return "OK"


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", default="127.0.0.1", help="The ip to listen on. Default is 127.0.0.1")
    parser.add_argument("--port", type=int, default=5000, help="The port to listen on. Default is 5000")
    parser.add_argument("--bpm", type=int, default=120, help="The bpm to use. Default is 120")
    args = parser.parse_args()

    bpm = args.bpm

    url = "http://{}:{}".format(args.ip, args.port)
    webbrowser.open(url)


    app.run(host=args.ip, port=args.port)