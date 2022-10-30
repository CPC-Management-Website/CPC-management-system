from flask import request
from app import create_app
app = create_app()


# Defining functionality for "/data" endpoint
@app.route('/data', methods=["GET"], strict_slashes=False)
def get_data():
    return {
		"X":"dataaa"
		}


@app.route("/login", methods=["POST"], strict_slashes=False)
def login_user():
    email = request.json["email"]
    print(email)
    return {"email" : email}

# Running app
if __name__ == '__main__':
	app.run(debug=True)