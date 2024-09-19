from datetime import datetime
from .models import ProgressPerContest


def init_cli(app):
    @app.cli.command()
    def update_progress():
        """Update contests progress"""
        with app.test_request_context():
            app.preprocess_request()
            print(datetime.utcnow(), "Updating Contests Progress...")
            ProgressPerContest.update_all_progress()
            print(datetime.utcnow(), "Done!")
            print()
