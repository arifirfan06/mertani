<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let showDropdown = false; // For sensor selection dropdown
  let showRainfallTypeDropdown = false; // New state for Rainfall chart type dropdown

  let sensors = [
    { name: 'Water Level', checked: true },
    { name: 'Rainfall', checked: true },
    { name: 'Wind Direction', checked: true }
  ];

  let selectAll = true;
  let dateStart = "2025-01-11T00:00";
  let dateEnd = "2025-01-21T23:00";
  let showChart = true;

  let chartInstance;
  let canvasRef;

  // New state to control Rainfall chart type
  let rainfallChartType = 'line'; // Default for Rainfall: 'line' or 'bar'

  // Full sensorData with more points and matching image values
  let rawSensorData = [
    { time: "11/01/25", Rainfall: 13, "Water Level": 47, "Wind Direction": 76 },
    { time: "12/01/25", Rainfall: 27, "Water Level": 54, "Wind Direction": 90 },
    { time: "13/01/25", Rainfall: 34, "Water Level": 67, "Wind Direction": 100 },
    { time: "14/01/25", Rainfall: 20, "Water Level": 60, "Wind Direction": 260 }, // This point is highlighted in the image
    { time: "15/01/25", Rainfall: 10, "Water Level": 54, "Wind Direction": 200 },
    { time: "16/01/25", Rainfall: 5, "Water Level": 47, "Wind Direction": 180 },
    { time: "17/01/25", Rainfall: 13, "Water Level": 60, "Wind Direction": 150 },
    { time: "18/01/25", Rainfall: 20, "Water Level": 47, "Wind Direction": 100 },
    { time: "19/01/25", Rainfall: 7, "Water Level": 34, "Wind Direction": 80 },
    { time: "20/01/25", Rainfall: 0, "Water Level": 27, "Wind Direction": 70 },
    { time: "21/01/25", Rainfall: 7, "Water Level": 34, "Wind Direction": 50 },
  ];

  // Filtered sensor data based on date range
  let filteredSensorData = [];

  function parseDate(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = 2000 + parseInt(parts[2], 10); // Assuming 20YY format
      return new Date(year, month, day);
    }
    return null;
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
    showRainfallTypeDropdown = false; // Close other dropdown
  }

  function toggleRainfallTypeDropdown() {
    showRainfallTypeDropdown = !showRainfallTypeDropdown;
    showDropdown = false; // Close other dropdown
  }

  function selectRainfallChartType(type) {
    rainfallChartType = type;
    showRainfallTypeDropdown = false; // Close dropdown after selection
    updateChart(); // Redraw chart with new type
  }

  function toggleSelectAll() {
    selectAll = !selectAll;
    sensors = sensors.map(s => ({ ...s, checked: selectAll }));
    updateChart();
  }

  function closeAllDropdowns() { // Function to close all dropdowns
    showDropdown = false;
    showRainfallTypeDropdown = false;
  }

  function applySelection() {
    showDropdown = false;
    showChart = true;
    updateChart();
  }

  function updateChart() {
    const startDateTime = new Date(dateStart);
    const endDateTime = new Date(dateEnd);

    filteredSensorData = rawSensorData.filter(d => {
      const dataDate = parseDate(d.time);
      return dataDate >= startDateTime && dataDate <= endDateTime;
    });

    const labels = filteredSensorData.map(d => d.time);
    const selected = sensors.filter(s => s.checked);

    const datasets = selected.map(sensor => {
      let color;
      let yAxisID;
      let chartType; // Type for this specific dataset
      let backgroundColor;
      let tension;
      let pointRadius;
      let pointHoverRadius;

      switch (sensor.name) {
        case 'Water Level':
          color = '#f59e0b'; // orange
          yAxisID = 'y-waterlevel';
          chartType = 'line'; // Always line
          backgroundColor = color;
          tension = 0.4;
          pointRadius = 3;
          pointHoverRadius = 5;
          break;
        case 'Rainfall':
          color = '#3b82f6'; // blue
          yAxisID = 'y-rainfall';
          chartType = rainfallChartType; // Controlled by rainfallChartType state
          if (chartType === 'bar') {
            backgroundColor = color + '80'; // Blue with transparency for bars
            tension = 0; // No tension for bars
            pointRadius = 0; // No points for bars
            pointHoverRadius = 0; // No hover points for bars
          } else { // It's a line
            backgroundColor = color;
            tension = 0.4;
            pointRadius = 3;
            pointHoverRadius = 5;
          }
          break;
        case 'Wind Direction':
          color = '#ef4444'; // red
          yAxisID = 'y-winddirection';
          chartType = 'line'; // Always line
          backgroundColor = color;
          tension = 0.4;
          pointRadius = 3;
          pointHoverRadius = 5;
          break;
      }

      return {
        label: sensor.name,
        data: filteredSensorData.map(d => d[sensor.name]),
        borderColor: color,
        backgroundColor: backgroundColor,
        yAxisID: yAxisID,
        tension: tension,
        fill: false,
        pointRadius: pointRadius,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverRadius: pointHoverRadius,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        type: chartType // Assign the specific chart type per dataset
      };
    });

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvasRef, {
      type: 'line', // Base type can be 'line', individual dataset types will override
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        stacked: false, // Important for mixed chart types
        plugins: {
          tooltip: {
            callbacks: {
              title: function (ctx) {
                if (ctx.length > 0) {
                  return ctx[0].label;
                }
                return '';
              },
              label: function (ctx) {
                const value = ctx.raw;
                let unit = '';
                switch (ctx.dataset.label) {
                  case 'Wind Direction':
                    unit = '° BL';
                    break;
                  case 'Rainfall':
                    unit = ' mm';
                    break;
                  case 'Water Level':
                    unit = ' cm';
                    break;
                }
                return `${ctx.dataset.label} : ${value}${unit}`;
              },
              footer: function(tooltipItems) {
                const waterLevelItem = tooltipItems.find(item => item.dataset.label === 'Water Level');
                const windDirectionItem = tooltipItems.find(item => item.dataset.label === 'Wind Direction');
                const rainfallItem = tooltipItems.find(item => item.dataset.label === 'Rainfall');

                let footerText = [];
                if (waterLevelItem) footerText.push(`Water level : ${waterLevelItem.raw} cm`);
                if (windDirectionItem) footerText.push(`Wind Direction : ${windDirectionItem.raw}° BL`);
                if (rainfallItem) footerText.push(`Rainfall : ${rainfallItem.raw} mm`);

                return footerText.join('\n');
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            footerColor: '#fff',
            padding: 10,
            displayColors: false,
            boxPadding: 4,
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 10
              }
            }
          },
          'y-waterlevel': {
            type: 'linear',
            display: selected.some(s => s.name === 'Water Level'),
            position: 'left',
            title: { display: true, text: 'Water level (cm)', color: '#f59e0b' },
            grid: {
              drawOnChartArea: true,
              color: '#e5e7eb'
            },
            ticks: {
              color: '#f59e0b',
              font: {
                size: 10
              },
              stepSize: 7
            },
            min: 0,
            max: 80,
          },
          'y-rainfall': {
            type: 'linear',
            display: selected.some(s => s.name === 'Rainfall'),
            position: 'left',
            title: { display: true, text: 'Rainfall (mm)', color: '#3b82f6' },
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: '#3b82f6',
              font: {
                size: 10
              },
              stepSize: 7
            },
            min: 0,
            max: 40,
          },
          'y-winddirection': {
            type: 'linear',
            display: selected.some(s => s.name === 'Wind Direction'),
            position: 'right',
            title: { display: true, text: 'Wind Direction (°)', color: '#ef4444' },
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: '#ef4444',
              font: {
                size: 10
              },
              stepSize: 50
            },
            min: 0,
            max: 360,
          }
        }
      }
    });
  }

  // Reactive statement to update chart when dateStart, dateEnd, or rainfallChartType changes
  $: dateStart, dateEnd, rainfallChartType, updateChart();

  onMount(() => {
    updateChart();
    window.addEventListener('resize', updateChart);
    document.addEventListener('click', (e) => {
      // Close all dropdowns if click is outside the main dropdown container (relative)
      if (!e.target.closest('.relative')) {
        closeAllDropdowns();
      }
    });
    return () => {
      window.removeEventListener('resize', updateChart);
      document.removeEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
          closeAllDropdowns();
        }
      });
    };
  });
</script>


<div class="p-6 space-y-6 bg-white rounded-xl shadow-sm font-inter">
  <div class="flex justify-between items-center border-b pb-4">
    <div>
      <h2 class="text-lg font-semibold text-gray-800">Nama Device</h2>
      <p class="text-sm text-gray-500">Id Device</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Online</span>
      <button class="text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m7-5h4m0 0v4m0-4l-5 5M4 16v4m0 0h4m0-4l5 5m7-5h4m0 0v4m0-4l-5 5"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="flex flex-wrap gap-4 items-center">
    <div class="relative">
      <button on:click={toggleDropdown} class="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1">
        <span class="text-gray-500 text-xl">+</span> Pilih Sensor
      </button>

      {#if showDropdown}
        <div class="absolute z-50 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div class="flex justify-between items-center mb-3">
            <span class="font-medium text-gray-700">Pilih Sensor</span>
            <button on:click={closeAllDropdowns} class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-2 max-h-48 overflow-auto">
            {#each sensors as sensor, i}
              <label class="flex items-center gap-2 text-gray-700">
                <input type="checkbox" bind:checked={sensors[i].checked} on:change={updateChart} class="accent-orange-500 h-4 w-4" />
                <span>{sensor.name}</span>
              </label>
            {/each}
            <label class="flex items-center gap-2 border-t pt-2 mt-2 text-gray-700">
              <input type="checkbox" bind:checked={selectAll} on:change={toggleSelectAll} class="accent-orange-500 h-4 w-4" />
              <span>Pilih Semua</span>
            </label>
          </div>
          <button on:click={applySelection} class="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-md">
            Tampilkan
          </button>
        </div>
      {/if}
    </div>

    <div class="flex flex-col sm:flex-row items-center gap-2">
      <input type="datetime-local" bind:value={dateStart} class="border border-gray-300 px-3 py-1.5 rounded-md text-sm text-gray-600 w-full sm:w-52" />
      <span class="text-gray-500">→</span>
      <input type="datetime-local" bind:value={dateEnd} class="border border-gray-300 px-3 py-1.5 rounded-md text-sm text-gray-600 w-full sm:w-52" />
      <button class="text-gray-400 hover:text-gray-600 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
    </div>

    <div class="relative">
      <button on:click={toggleRainfallTypeDropdown} class="border border-gray-300 rounded-md text-sm px-3 py-1.5 text-gray-600 flex items-center gap-1">
        Rainfall: {rainfallChartType === 'line' ? 'Garis' : 'Batang'}
        <svg class="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </button>
      {#if showRainfallTypeDropdown}
        <div class="absolute z-50 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          <button on:click={() => selectRainfallChartType('line')} class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 {rainfallChartType === 'line' ? 'bg-gray-100 font-medium' : ''}">
            Garis (Rainfall)
          </button>
          <button on:click={() => selectRainfallChartType('bar')} class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 {rainfallChartType === 'bar' ? 'bg-gray-100 font-medium' : ''}">
            Batang (Rainfall)
          </button>
        </div>
      {/if}
    </div>

    <button class="text-gray-600 border border-gray-300 rounded-md px-2 py-1.5 hover:bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 13l-7 7-7-7m14-4l-7-7-7 7" />
      </svg>
    </button>
  </div>

  {#if showChart}
    <div class="mt-6 relative" style="height: 400px;">
      <canvas bind:this={canvasRef}></canvas>
    </div>

    <div class="mt-8 border border-gray-200 rounded-lg overflow-hidden">
      <div class="px-4 py-3 font-semibold bg-gray-50 text-gray-700 border-b border-gray-200">Data Pemantauan</div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-2 whitespace-nowrap">Tanggal & Waktu</th>
              {#each sensors.filter(s => s.checked) as s}
                <th class="px-4 py-2 whitespace-nowrap">{s.name} {s.name === "Wind Direction" ? "(°)" : s.name === "Rainfall" ? "(mm)" : "(cm)"}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each filteredSensorData as row}
              <tr class="border-t border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-2 whitespace-nowrap">{row.time}</td>
                {#each sensors.filter(s => s.checked) as s}
                  <td class="px-4 py-2 whitespace-nowrap">{row[s.name]}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center text-center py-16">
      <div class="bg-orange-100 rounded-md p-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 4v16h16V4H4zm8 11l-3-3 1.41-1.41L12 12.17l4.59-4.58L18 9l-6 6z" stroke-width="1.5"/>
        </svg>
      </div>
      <p class="mt-6 text-lg font-semibold text-gray-700">
        Pilih sensor diatas untuk menampilkan grafik & tabel data!
      </p>
      <p class="mt-1 text-sm text-gray-500">
        Anda dapat menentukan rentang waktu dan mengelompokkan data sesuai kebutuhan.
      </p>
    </div>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .font-inter {
    font-family: 'Inter', sans-serif;
  }
</style>