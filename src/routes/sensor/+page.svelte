<script lang="ts">
  // Placeholder data for the sensor table
  interface Sensor {
    name: string;
    id: string;
    calibrationFactor: string;
    unit: string;
    description: string;
  }

  let sensors: Sensor[] = [
    {
      name: 'Rainfall',
      id: 'HAHA-rnFL',
      calibrationFactor: 'x*0.2',
      unit: 'mm',
      description: 'auto create'
    },
    {
      name: 'wind direction',
      id: 'HAHA-windir',
      calibrationFactor: 'X*1.5',
      unit: '°',
      description: 'auto create'
    },
    {
      name: 'water level',
      id: 'Sensor Type B',
      calibrationFactor: 'Belum dikalibrasi',
      unit: 'm',
      description: 'auto create'
    }
  ];

  let searchTerm = '';
  let selectedFilter = 'Nama';
  let itemsPerPage = 5;

  // State for the Add/Edit form
  let showForm = false;
  let isEditing = false;
  let currentSensorId: string | null = null; // Stores the ID of the sensor being edited
  let newSensor: Sensor = {
    name: '',
    id: '',
    calibrationFactor: '',
    unit: '',
    description: ''
  };

  // State for delete confirmation
  let showDeleteConfirm = false;
  let sensorToDeleteId: string | null = null;

  // Function to reset the form fields
  function resetForm() {
    newSensor = {
      name: '',
      id: '',
      calibrationFactor: '',
      unit: '',
      description: ''
    };
    isEditing = false;
    currentSensorId = null;
  }

  // Opens the form for adding a new sensor
  function openAddForm() {
    resetForm();
    showForm = true;
  }

  // Opens the form for editing an existing sensor
  function openEditForm(sensor: Sensor) {
    isEditing = true;
    currentSensorId = sensor.id;
    newSensor = { ...sensor }; // Create a copy to avoid direct mutation
    showForm = true;
  }

  // Handles saving a new or updated sensor
  function saveSensor() {
    if (isEditing && currentSensorId) {
      // Update existing sensor
      sensors = sensors.map(s => (s.id === currentSensorId ? { ...newSensor } : s));
    } else {
      // Add new sensor (ensure unique ID or generate one)
      // For simplicity, we'll just add it. In a real app, you'd generate a unique ID.
      sensors = [...sensors, { ...newSensor, id: newSensor.id || `SENSOR-${Date.now()}` }];
    }
    showForm = false;
    resetForm();
  }

  // Cancels the form operation
  function cancelForm() {
    showForm = false;
    resetForm();
  }

  // Initiates the delete confirmation dialog
  function confirmDelete(sensorId: string) {
    sensorToDeleteId = sensorId;
    showDeleteConfirm = true;
  }

  // Cancels the delete operation
  function cancelDelete() {
    showDeleteConfirm = false;
    sensorToDeleteId = null;
  }

  // Executes the delete operation after confirmation
  function executeDelete() {
    if (sensorToDeleteId) {
      sensors = sensors.filter(s => s.id !== sensorToDeleteId);
      cancelDelete();
    }
  }

  // Placeholder for search functionality (not fully implemented in this example)
  function handleSearch() {
    console.log('Searching for:', searchTerm, 'with filter:', selectedFilter);
    // In a real app, you'd filter the 'sensors' array based on searchTerm and selectedFilter
  }
</script>

<div class="font-sans p-4 bg-white rounded-lg shadow-md max-w-5xl mx-auto my-5">
  <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
    <h1 class="text-2xl font-semibold text-gray-800 mb-3 md:mb-0">Manajemen Sensor</h1>
    <button
      class="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md text-base flex items-center transition-colors duration-200"
      on:click={openAddForm}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-5 h-5 mr-1"
      >
        <path d="M12 4.5v15M4.5 12h15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      Tambah Sensor
    </button>
  </header>

  {#if showForm}
    <div class="bg-gray-50 p-6 rounded-lg mb-5 border border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Sensor' : 'Tambah Sensor Baru'}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="sensorName" class="block text-sm font-medium text-gray-700">Nama Sensor</label>
          <input
            type="text"
            id="sensorName"
            bind:value={newSensor.name}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nama Sensor"
          />
        </div>
        <div>
          <label for="sensorId" class="block text-sm font-medium text-gray-700">Id Sensor</label>
          <input
            type="text"
            id="sensorId"
            bind:value={newSensor.id}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="ID Sensor"
            disabled={isEditing} />
        </div>
        <div>
          <label for="calibrationFactor" class="block text-sm font-medium text-gray-700">Faktor Kalibrasi</label>
          <input
            type="text"
            id="calibrationFactor"
            bind:value={newSensor.calibrationFactor}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Faktor kalibrasi (e.g., x*0.2)"
          />
        </div>
        <div>
          <label for="unit" class="block text-sm font-medium text-gray-700">Satuan</label>
          <input
            type="text"
            id="unit"
            bind:value={newSensor.unit}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Satuan (e.g., mm, °)"
          />
        </div>
        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            id="description"
            bind:value={newSensor.description}
            rows="2"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Deskripsi sensor"
          ></textarea>
        </div>
      </div>
      <div class="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          on:click={cancelForm}
        >
          Batal
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          on:click={saveSensor}
        >
          Simpan
        </button>
      </div>
    </div>
  {/if}

  <div class="flex flex-col md:flex-row gap-4 mb-5">
    <div class="relative w-full md:w-auto">
      <select bind:value={selectedFilter} class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:border-blue-500">
        <option value="Nama">Nama</option>
        <option value="Id Sensor">Id Sensor</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
    <div class="relative flex-grow">
      <input
        type="text"
        placeholder="Cari"
        bind:value={searchTerm}
        on:input={handleSearch}
        class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
      <button class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500" on:click={handleSearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </button>
    </div>
  </div>

  <div class="overflow-x-auto border border-gray-200 rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span class="inline-flex items-center">Nama Sensor
              <div class="ml-2 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M5 15l7-7 7 7z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M19 9l-7 7-7-7z"/></svg>
              </div>
            </span>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span class="inline-flex items-center">Id Sensor
              <div class="ml-2 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M5 15l7-7 7 7z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M19 9l-7 7-7-7z"/></svg>
              </div>
            </span>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span class="inline-flex items-center">Faktor kalibrasi
              <div class="ml-2 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M5 15l7-7 7 7z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M19 9l-7 7-7-7z"/></svg>
              </div>
            </span>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span class="inline-flex items-center">Satuan
              <div class="ml-2 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M5 15l7-7 7 7z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-gray-400"><path d="M19 9l-7 7-7-7z"/></svg>
              </div>
            </span>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each sensors as sensor (sensor.id)}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sensor.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sensor.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
              {#if sensor.calibrationFactor === 'Belum dikalibrasi'}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Belum dikalibrasi</span>
              {:else}
                {sensor.calibrationFactor}
              {/if}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sensor.unit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sensor.description}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  on:click={() => openEditForm(sensor)}
                >
                  Edit
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  on:click={() => confirmDelete(sensor.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <footer class="flex flex-col md:flex-row justify-between items-center mt-5 pt-4 border-t border-gray-200">
    <div class="flex items-center space-x-2 mb-3 md:mb-0 text-sm text-gray-600">
      Tampilkan
      <div class="relative">
        <select bind:value={itemsPerPage} class="block appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-blue-500">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
    <div class="text-sm text-gray-600 mb-3 md:mb-0">
      1 dari {sensors.length} Halaman
    </div>
    <div class="flex space-x-2">
      <button class="bg-white border border-gray-300 text-gray-600 py-1.5 px-3 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M15 18l-6-6 6-6z"/>
        </svg>
      </button>
      <button class="bg-white border border-gray-300 text-gray-600 py-1.5 px-3 rounded-md hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M9 18l6-6-6-6z"/>
        </svg>
      </button>
    </div>
  </footer>

  {#if showDeleteConfirm}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Konfirmasi Hapus</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Apakah Anda yakin ingin menghapus sensor ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            on:click={cancelDelete}
          >
            Batal
          </button>
          <button
            type="button"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            on:click={executeDelete}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
