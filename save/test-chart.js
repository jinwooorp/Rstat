const tempCanvas = document.getElementById('temp-chart');
const humidCanvas = document.getElementById('humid-chart');
const tempValueEl = document.getElementById('temp-value');
const humidityValueEl = document.getElementById('humidity-value');
const serverTempValueEl = document.getElementById('server-temp-value');
const latestTimeEl = document.getElementById('latest-time');

if (!tempCanvas || !humidCanvas) {
	console.warn('Chart canvas not found: #temp-chart or #humid-chart');
} else {
	const baseOptions = {
		responsive: true,
		interaction: {
			mode: 'index',
			intersect: false
		}
	};

	const tempChart = new Chart(tempCanvas, {
		type: 'line',
		data: {
			labels: [],
			datasets: [
				{
					label: 'Room Temp (C)',
					data: [],
					borderColor: '#3e95cd',
					fill: false
				}
			]
		},
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

	const humidChart = new Chart(humidCanvas, {
		type: 'line',
		data: {
			labels: [],
			datasets: [
				{
					label: 'Humidity (%)',
					data: [],
					borderColor: '#8e5ea2',
					fill: false
				}
			]
		},
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

	const fetchJson = async (url) => {
		const response = await fetch(url, { cache: 'no-store' });
		if (!response.ok) {
			throw new Error(`Request failed: ${response.status}`);
		}
		return response.json();
	};

	const formatValue = (value, unit) => {
		if (value === null || value === undefined) {
			return '--';
		}
		return `${Number(value).toFixed(1)}${unit}`;
	};

	const formatTimeLabel = (isoString) => {
		if (!isoString) {
			return '';
		}
		const date = new Date(isoString);
		return date.toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const formatDateTime = (isoString) => {
		if (!isoString) {
			return '--';
		}
		const date = new Date(isoString);
		return date.toLocaleString('ko-KR');
	};

	const refreshSummary = async () => {
		try {
			const summary = await fetchJson('/api/summary');
			if (tempValueEl) {
				tempValueEl.textContent = formatValue(summary.temperature, '°C');
			}
			if (humidityValueEl) {
				humidityValueEl.textContent = formatValue(summary.humidity, '%');
			}
			if (serverTempValueEl) {
				serverTempValueEl.textContent =
					summary.server_temperature === null || summary.server_temperature === undefined
						? '--'
						: formatValue(summary.server_temperature, '°C');
			}
			if (latestTimeEl) {
				latestTimeEl.textContent = formatDateTime(summary.latest_timestamp);
			}
		} catch (error) {
			console.warn('Failed to refresh summary', error);
		}
	};

	const refreshCharts = async () => {
		try {
			const series = await fetchJson('/api/series');
			const items = series.items || [];
			const labels = items.map((item) => formatTimeLabel(item.timestamp));
			const temperatures = items.map((item) => item.temperature);
			const humidities = items.map((item) => item.humidity);

			tempChart.data.labels = labels;
			tempChart.data.datasets[0].data = temperatures;
			tempChart.update();

			humidChart.data.labels = labels;
			humidChart.data.datasets[0].data = humidities;
			humidChart.update();
		} catch (error) {
			console.warn('Failed to refresh charts', error);
		}
	};

	refreshSummary();
	refreshCharts();

	setInterval(refreshSummary, 30 * 60 * 1000);
	setInterval(refreshCharts, 2 * 60 * 60 * 1000);
}
