console.log("app.js 시작");
async function loadData(){

    console.log("loadData 실행");

    const response = await fetch("/average");

    const data = await response.json();

    console.log(data);


    document.getElementById("temp").innerHTML =
        data.temperature + " ℃";


    document.getElementById("hum").innerHTML =
        data.humidity + " %";

}


loadData();