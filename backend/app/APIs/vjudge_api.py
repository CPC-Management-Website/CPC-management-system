import json
import os
import pickle
from collections import defaultdict

import requests
from dotenv import load_dotenv

COOKIE_STORAGE_FILE = "cache/vjudge_session_cookies.pickle"

load_dotenv()

# header for requesting data
_headers = {
    "authority": "vjudge.net",
    "accept": "application/json, text/javascript, */*; q=0.01",
    "sec-fetch-dest": "empty",
    "x-requested-with": "XMLHttpRequest",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://vjudge.net",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "referer": "https://vjudge.net/status/",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
}

# form data
_data = {
    "draw": "1",
    "columns[0][data]": "0",
    "columns[0][name]": "",
    "columns[0][searchable]": "true",
    "columns[0][orderable]": "false",
    "columns[0][search][value]": "",
    "columns[0][search][regex]": "false",
    "columns[1][data]": "1",
    "columns[1][name]": "",
    "columns[1][searchable]": "true",
    "columns[1][orderable]": "false",
    "columns[1][search][value]": "",
    "columns[1][search][regex]": "false",
    "columns[2][data]": "2",
    "columns[2][name]": "",
    "columns[2][searchable]": "true",
    "columns[2][orderable]": "false",
    "columns[2][search][value]": "",
    "columns[2][search][regex]": "false",
    "columns[3][data]": "3",
    "columns[3][name]": "",
    "columns[3][searchable]": "true",
    "columns[3][orderable]": "false",
    "columns[3][search][value]": "",
    "columns[3][search][regex]": "false",
    "columns[4][data]": "4",
    "columns[4][name]": "",
    "columns[4][searchable]": "true",
    "columns[4][orderable]": "false",
    "columns[4][search][value]": "",
    "columns[4][search][regex]": "false",
    "columns[5][data]": "5",
    "columns[5][name]": "",
    "columns[5][searchable]": "true",
    "columns[5][orderable]": "false",
    "columns[5][search][value]": "",
    "columns[5][search][regex]": "false",
    "columns[6][data]": "6",
    "columns[6][name]": "",
    "columns[6][searchable]": "true",
    "columns[6][orderable]": "false",
    "columns[6][search][value]": "",
    "columns[6][search][regex]": "false",
    "columns[7][data]": "7",
    "columns[7][name]": "",
    "columns[7][searchable]": "true",
    "columns[7][orderable]": "false",
    "columns[7][search][value]": "",
    "columns[7][search][regex]": "false",
    "columns[8][data]": "8",
    "columns[8][name]": "",
    "columns[8][searchable]": "true",
    "columns[8][orderable]": "false",
    "columns[8][search][value]": "",
    "columns[8][search][regex]": "false",
    "columns[9][data]": "9",
    "columns[9][name]": "",
    "columns[9][searchable]": "true",
    "columns[9][orderable]": "false",
    "columns[9][search][value]": "",
    "columns[9][search][regex]": "false",
    "start": 0,
    "length": 20,
    "search[value]": "",
    "search[regex]": "false",
    "onlyFollowee": "false",
    "orderBy": "run_id",
}


def get_vjudge_data(
    username: str = "",
    oj_id: str = "All",
    problem_no: str = "",
    language: str = "",
    result: str = 0,
    contest_id: str = "",
    limit: int = 0,
):
    """Function to return vjudge based on parameters

    Parameters:
    username (str): username to search (empty -> all usernames)
    oj_id (str): online judge
        options: All, CodeForces, CodeChef, Gym, LightOJ, UVA, UVALive, Kattis, AtCoder, SPOJ, TopCoder, etc.
        (ignored if contest_id is specified)
    problem_no (str): problem number (can be found from a problem url in vjudge)
        (if contest id is specified, problem_no is A, B, C, etc. of contest)
    language (str): language of submission
        options: C, CPP, JAVA, PASCAL, PYTHON, CSHARP, RUBY, OTHER (empty -> all)
    result (int): result of submission
        options:
        0 -> All
        1 -> Accepted
        2 -> Presentation Error
        3 -> Wrong Answer
        4 -> Time Limit Exceed
        5 -> Memory Limit Exceed
        6 -> Output Limit Exceed
        7 -> Runtime Error
        8 -> Compile Error
        9 -> Unknown Error
        10 -> Submit Error
        11 -> Queuing && Judging
    contest_id (str): contest id (empty -> no particular contest)
    limit (int): maximum number of returned entries (0 -> no limit)

    Returns:
        list: list of dictionaries containing the entries

    """

    # generate data
    query_data = {
        "start": 0,
        "length": 20,
        "un": username,
        "res": result,
        "language": language,
    }

    # if contest_id is specified
    if contest_id:
        query_data["inContest"] = True
        query_data["contestId"] = contest_id
        query_data["num"] = problem_no if problem_no else "-"
    else:
        query_data["OJId"] = oj_id
        query_data["probNum"] = problem_no

    res = []
    # set limit to a very large integer if limit = 0
    limit = 2**63 if limit == 0 else limit
    length_per_query = min(limit, 20)  # max: 20
    query_data["start"] = 0
    query_data["length"] = length_per_query

    while len(res) < limit:
        response = requests.get(
            "https://vjudge.net/status/data",
            headers=_headers,
            params={**_data, **query_data},
        )
        entries = response.json()["data"]
        if entries:
            res += entries
        else:
            break  # if no more responses break

        query_data["start"] += length_per_query

    return res[:limit]


def get_progress_old(contest_id):
    res = get_vjudge_data(contest_id=contest_id, result=1)
    num_solved = defaultdict(lambda: 0)
    solved_problems = defaultdict(lambda: set())

    for result in res:
        solved_problems[result["userName"]].add(result["problemId"])

    for userName, problems in solved_problems.items():
        num_solved[userName] = len(problems)

    return


def get_progress(contest_id, session):
    data_request = "https://vjudge.net/contest/rank/single/{contestID}".format(
        contestID=contest_id
    )
    try:
        response = session.get(data_request)

        vjudge = dict()
        progress = defaultdict(lambda: 0)
        solved_problems = defaultdict(set)

        if len(response.content) == 0:
            # this means that we cannot access this contest with the given account
            return None

        if len(response.text) == 0:
            # if the contest has no submissions, the response.text would be empty and
            # calling json.loads() would raise an exception,
            # so we return an empty progress
            return progress

        participants = json.loads(response.text)["participants"]
        submissions = json.loads(response.text)["submissions"]

        for participant in participants.items():
            contestant_id = participant[0]
            vjudge_handle = participant[1][0]
            vjudge[contestant_id] = vjudge_handle
            progress[vjudge_handle] = 0

        for submission in submissions:
            contestant_id = submission[0]
            accepted = submission[2]  # 1 for accepted, 0 otherwise
            problem_id = submission[1]

            if accepted:
                vjudge_handle = vjudge[str(contestant_id)]
                solved_problems[vjudge_handle].add(problem_id)

        for contestant in progress:
            progress[contestant] = len(solved_problems[contestant])

        return progress

    except Exception as e:
        print(e)
        return None


def session_valid(session):
    # make sure that the contest is PRIVATE
    # also make sure that the account you're using can access that contest
    contest_id = 541074

    # This contest will be used to check if the login session is still valid
    # by trying to get the data for that contest

    # Provided that the account you're using can normally access that contest, if you
    # get an empty response.content for that contest it means that you're not logged in

    data_request = "https://vjudge.net/contest/rank/single/{contestID}".format(
        contestID=contest_id
    )
    response = session.get(data_request)
    if len(response.content) == 0:
        print("Invalid or stale session")
        return False
    return True


def save_session_cookies(session):
    with open(COOKIE_STORAGE_FILE, "wb") as f:
        pickle.dump(session.cookies, f)


def load_session_cookies():
    try:
        with open(COOKIE_STORAGE_FILE, "rb") as f:
            cookies = pickle.load(f)
            return cookies
    except Exception as e:
        print("Error getting stored session cookies")
        print(e)
        return None


def vjudge_login():
    cookies = load_session_cookies()
    with requests.session() as session:
        if cookies is not None:
            print("Reusing stored cookies")
            session.cookies = cookies
            if session_valid(session):
                return session

        print("Logging in!")
        login_request_url = "https://vjudge.net/user/login"
        data = {
            "username": os.getenv("VJUDGE_USERNAME"),
            "password": os.getenv("VJUDGE_PASSWORD"),
        }
        login = session.post(url=login_request_url, data=data)
        print("Login status:", login.text)
        if login.text == "success":
            print("Storing session cookies")
            save_session_cookies(session)
            return session
        return None


def get_progress_test(contest_id):
    session = vjudge_login()
    if session is None:
        print("Couldn't login")
        return None
    return get_progress(contest_id=contest_id, session=session)


def get_progress_bulk(contests):
    session = vjudge_login()
    if session is None:
        print("Couldn't login")
        return None

    progress = dict()

    for contest_id in contests:
        print(f"Getting data for contest {contest_id}")
        curr_progress = get_progress(contest_id=contest_id, session=session)
        if curr_progress is None:
            print(f"Couldn't get data for contest {contest_id}")
            continue
        progress[contest_id] = curr_progress
    return progress


def _main():
    contest_id = (
        541074  # make sure that the account you're using can access this contest
    )

    # res = get_vjudge_data(contest_id = contest_id)
    # filtered_res = {}
    # for x in res:
    #     filtered_res[(x['problemId'],x['userName'])] = x
    #     #print(x)

    # for x in filtered_res:
    #     print (x)

    progress = get_progress_test(contest_id=contest_id)
    if progress is None:
        print("Cannot access contest")
    else:
        print(progress)


if __name__ == "__main__":
    _main()
