<script setup>
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import jsonData from '@/assets/api/data.json';
import darkModeArrow from '@/assets/icon/arrow-down-dark.svg';
import lightModeArrow from '@/assets/icon/arrow-down-light.svg';
import darkModeSearch from '@/assets/icon/search-icon-dark.svg';
import lightModeSearch from '@/assets/icon/search-icon.svg';

const selectedRegion = ref(null);
const selectedRegionName = ref("Filter by Region");
const showDropdown = ref(false);
const searchQuery = ref('');
const store = useStore();
const isDarkMode = computed(() => store.state.isDarkMode);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleDarkModeChange = () => {
  console.log(`Dark Mode Toggled: ${isDarkMode.value ? 'On' : 'Off'}`);
};

const selectRegion = (region) => {
  selectedRegion.value = region;
  selectedRegionName.value = region || "All";
  showDropdown.value = false;
};

const uniqueRegions = computed(() => {
  const uniqueRegionSet = new Set();
  for (const country of jsonData) {
    uniqueRegionSet.add(country.region);
  }
  return Array.from(uniqueRegionSet);
});

const filteredData = computed(() => {
  if (selectedRegion.value === null) {
    return jsonData;
  } else {
    return jsonData.filter((country) => country.region === selectedRegion.value);
  }
});

const searchResults = computed(() => {
  if (!searchQuery.value) return filteredData.value;
  return filteredData.value.filter(country =>
    country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  selectedRegion.value = null;
  handleDarkModeChange();
});
</script>

<template>
  <body :class="{ 'dark-background': isDarkMode, 'light-background': !isDarkMode }">
    <Navbar />
    <main :style="{ background: isDarkMode ? '#202D36' : 'white' }">
      <div class="navigation">
        <div :style="{ background: isDarkMode ? '#2B3743' : 'white' }" class="search">
          <button class="search-btn">
            <img :src="isDarkMode ? darkModeSearch : lightModeSearch" alt="">
          </button>
          <input :style="{ color: isDarkMode ? 'white' : 'black' }" type="text" placeholder="Search for a country..."
            v-model="searchQuery">
        </div>
        <div :style="{ background: isDarkMode ? '#2B3743' : 'white' }" class="filter">
          <div class="dropdown">
            <button class="filter-btn" @click="toggleDropdown">
              <p :style="{ color: isDarkMode ? 'white' : 'black' }">{{ selectedRegionName }}</p>
              <img :src="isDarkMode ? darkModeArrow : lightModeArrow" alt="">
            </button>
            <div :style="{ background: isDarkMode ? '#2B3743' : 'white' }" v-if="showDropdown" class="dropdown-content">
              <button :style="{ color: isDarkMode ? 'white' : 'black' }" @click="selectRegion(null)">All</button>
              <button :style="{ color: isDarkMode ? 'white' : 'black' }" class="region" v-for="region in uniqueRegions"
                @click="selectRegion(region)" :key="region">
                {{ region }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="country-wrapper">
        <div v-for="country in searchResults" :key="country.alpha2Code" class="country">
          <router-link :to="{ name: 'Detail', params: { index: jsonData.indexOf(country) } }">
            <div class="country-image">
              <img :src="country.flags.svg" :alt="`Flag of ${country.name}`" />
            </div>
            <div :style="{ background: isDarkMode ? '#2B3743' : 'white' }" class="country-info">
              <h2 :style="{ color: isDarkMode ? 'white' : 'black' }">{{ country.name }}</h2>
              <div class="country-info-wrapper">
                <div class="country-info-left">
                  <p :style="{ color: isDarkMode ? 'white' : 'black' }">Population: <span
                      :style="{ color: isDarkMode ? 'white' : 'black' }">{{ country.population }}</span></p>
                  <p :style="{ color: isDarkMode ? 'white' : 'black' }">Region: <span
                      :style="{ color: isDarkMode ? 'white' : 'black' }">{{ country.region }}</span></p>
                  <p :style="{ color: isDarkMode ? 'white' : 'black' }">Capital: <span
                      :style="{ color: isDarkMode ? 'white' : 'black' }">{{ country.capital }}</span></p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </body>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
}

body {
  background-color: white;
}

.dark-background {
  background-color: #202C37;
}

.light-background {
  background-color: #FAFAFA;
}

main {
  height: fit-content;
  background-color: #FAFAFA;
}

.navigation {
  height: fit-content;
  margin: 0rem 5rem;
  padding-top: 3rem;
  display: flex;
  justify-content: space-between;
}

.search {
  width: 40%;
  height: 70px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  background-color: white;
  box-shadow: rgba(65, 65, 65, 0.1) 0px 2px 8px 0px;
}

.search-btn {
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.search-btn img {
  width: 80%;
  height: 100%;
}

.search input {
  width: 100%;
  height: 2rem;
  margin-left: 1.5rem;
  background-color: transparent;
  font-size: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  color: #000;
}

.search input::placeholder {
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: #8A8A8A;
}

.filter {
  position: relative;
  z-index: 2;
  width: 20%;
  height: 70px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  background-color: white;
  box-shadow: rgba(65, 65, 65, 0.1) 0px 2px 8px 0px;
}

.filter-btn {
  width: 200px;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.filter-btn p {
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: #000;
}

.filter-btn img {
  width: 1rem;
  height: 1rem;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  width: 100%;
  margin-top: 30rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgba(65, 65, 65, 0.1) 0px 2px 8px 0px;
}

.dropdown-content button {
  width: 100%;
  height: 3rem;
  padding: 1rem;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: #000000;
  display: flex;
  padding-left: 1.5rem;
}

.country-wrapper {
  margin: 0rem 5rem;
  padding-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.country {
  width: calc(21% - 1rem);
  height: 350px;
  margin-bottom: 3rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgba(65, 65, 65, 0.1) 0px 2px 8px 0px;
}

.country a {
  text-decoration: none;
  border-radius: 0px 0px 5px 5px;
}

.country-image {
  width: 100%;
  height: 50%;
  border-radius: 5px 5px 0px 0px;
}

.country-image img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0px 0px;
}

.country-info {
  width: 100%;
  height: 50%;
  padding: 1rem;
  margin-bottom: 0;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  border-radius: 0px 0px 5px 5px;
}

.country-info h2 {
  font-family: 'Raleway', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #000;
  text-decoration: none;
}

.country-info-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.country-info-left {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.country-info-left p {
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #000;
  margin-bottom: 0.5rem;
}

.country-info-left p span {
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #000;
}

@media (max-width: 768px) {
  .navigation {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin-left: 0;
    margin-right: 0;
  }

  .search {
    width: 100%;
    height: 70px;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .search input {
    margin-left: 1rem;
  }

  .filter {
    width: 50%;
    height: 70px;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .filter-btn {
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: space-between;
  }

  .filter-btn img {
    width: 0.7rem;
    margin-left: 0.5rem;
    position: relative;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    width: 100%;
    margin-top: 20rem;
  }

  .dropdown-content button {
    width: 100%;
    height: 3rem;
    padding: 1rem;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: 'Raleway', sans-serif;
    font-weight: 500;
    font-size: 1rem;
    color: #000000;
  }

  .dropdown-content button:hover {
    background-color: #F2F2F2;
  }

  .country-wrapper {
    margin-left: 2rem;
    margin-right: 2rem;
    padding: 1rem;
  }

  .country {
    width: calc(100% - 1rem);
    height: fit-content;
    margin-bottom: 1rem;
  }
}</style>
