export default class APIService{
    static async loginUser(email){
        try {
            const response = await fetch(`http://127.0.0.1:5000/login`, {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(email)
            }).then(function(response){
                if (!response.ok){
                    const error = (response.json()) || response.status;
                    return Promise.reject(error);
                }

            })
        } catch (error) {
            error.then(function(value){
                console.log(value)
            })
        }
    }

    static async enterUser(email, firstName, lastName, vjudgeHandle, platformRole){
        try {
            const response = await fetch(`http://127.0.0.1:5000/userEntry`, {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(email, firstName, lastName, vjudgeHandle, platformRole)
            })
            console.log(response)
            response.json()
                .then(function (data) {
                })
        } catch (error) {
            console.log(error)
            //return console.log(error)
        }
    }

}