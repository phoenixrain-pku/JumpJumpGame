from flask import Flask, render_template, request
import pymysql
from flask_cors import CORS
import json

app = Flask(__name__, static_url_path = "", static_folder="static")
CORS(app, resources=r'/*')

db = pymysql.connect(host="localhost", user="username", password="password", database="database")

@app.route("/insert", methods=["POST"])
def insert():
    data = json.loads(request.get_data())

    cursor = db.cursor()

    try:
        cursor.execute("insert scores(name, score) values('{}', {})".format(data["name"], data["score"]))
        db.commit()
    except:
        db.rollback()

    return "success"

@app.route("/query", methods=["GET"])
def query():
    cursor = db.cursor()

    cursor.execute("select * from scores order by score desc limit 10")

    keys = []
    for column in cursor.description:
        keys.append(column[0])

    # data = []
    # for row in cursor.fetchall():
    #     item = dict()
    #     for i in range(len(keys)):
    #         item[keys[i]] = row[i];
    #     data.append(item)

    # return str(data)

    data = "排行榜\n"
    data += "rank 0"  + " : " + "PhoenixRain" + " : 9999\n"
    rank = 1
    for row in cursor.fetchall():
        data += "rank " + str(rank) + " : " + row[1] + " : " + str(row[2])
        data += "\n"
        rank += 1

    return data

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=port, debug=True)
