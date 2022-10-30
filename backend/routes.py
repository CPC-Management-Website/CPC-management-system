from flask import Flask
from app import create_app


app = create_app()


# Defining functionality for "/data" endpoint
@app.route('/data', methods=["GET"], strict_slashes=False)
def get_data():
    return {
		"X":"dataaa"
		}

	
# Running app
if __name__ == '__main__':
	app.run(debug=True)