export default class APIService{

    static async enterUser(email, firstName, lastName, vjudgeHandle, platformRole){
        try {
            const response = await fetch(`http://127.0.0.1:5000/userentry`, {
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

    static async enterFile(excelFile){
        try {
            const data = new FormData();
            data.append('excel-file', excelFile, 'file.xlsx');
            const response = await fetch(`http://127.0.0.1:5000/userentryfile`, { 
                'method': 'POST',
                /*headers: {
                    //'Content-Type': 'application/json'
                },*/
                body: data,
            })
            .then(res => res.json())
            .then(data => console.log(data));  
            //console.log(response) 
        } catch (error) {
            console.log(error)
        }
    }

}

