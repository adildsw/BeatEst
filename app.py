from flask import Flask, render_template

app = Flask(__name__, static_folder="web", template_folder="web")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port="8888", debug=True)