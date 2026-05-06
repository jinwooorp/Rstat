const tempCanvas = document.getElementById('temp-chart');
const humidCanvas = document.getElementById('humid-chart');

if (!tempCanvas || !humidCanvas) {
	console.warn('Chart canvas not found: #temp-chart or #humid-chart');
} else {
	const labels = [
		'AM 10:00',
		'AM 11:00',
		'PM 12:00',
		'PM 1:00',
		'PM 2:00',
		'PM 3:00'
	];

	const tempData = {
		labels: labels,
		datasets: [
			{
				label: 'Room Temp (C)',
				data: [24.4, 24.9, 25.2, 25.0, 24.7, 24.5],
				borderColor: '#3e95cd',
				fill: false
			},
			{
				label: 'Server Temp (C)',
				data: [48, 50, 52, 49, 47, 46],
				borderColor: '#3cba9f',
				fill: false
			}
		]
	};

	const humidData = {
		labels: labels,
		datasets: [
			{
				label: 'Humidity (%)',
				data: [55, 53, 52, 54, 58, 56],
				borderColor: '#8e5ea2',
				fill: false
			}
		]
	};

	const baseOptions = {
		responsive: true,
		interaction: {
			mode: 'index',
			intersect: false
		}
	};

	new Chart(tempCanvas, {
		type: 'line',
		data: tempData,
		options: {
			...baseOptions,
			title: {
				display: true,
				text: 'Temperature'
			},
			scales: {
				yAxes: [
					{
						type: 'linear',
						position: 'left',
						scaleLabel: {
							display: true,
							labelString: 'Temperature (C)'
						}
					}
				]
			}
		}
	});

	new Chart(humidCanvas, {
		type: 'line',
		data: humidData,
		options: {
			...baseOptions,
			title: {
				display: true,
				text: 'Humidity'
			},
			scales: {
				yAxes: [
					{
						type: 'linear',
						position: 'left',
						scaleLabel: {
							display: true,
							labelString: 'Humidity (%)'
						}
					}
				]
			}
		}
	});
}
