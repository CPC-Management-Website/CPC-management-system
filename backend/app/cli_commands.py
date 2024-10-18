from datetime import datetime
import os

import click
from .models import ProgressPerContest
from .models import User
from .models import Enrollment

current_season_id = os.getenv("CURRENT_SEASON_ID")


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

    @app.cli.command()
    @click.option("--email")
    def register_mentor(email):
        """Register email as a mentor in current season"""
        user_id = User.get_user_id(email)
        Enrollment.enroll(
            user_id=user_id, level_id=3, season_id=current_season_id, role_id=2
        )
