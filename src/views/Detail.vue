<script setup>
import { useStore } from 'vuex';
import Navbar from '@/components/Navbar.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import darkModeBack from '@/assets/icon/arrow-back-dark.svg';
import lightModeBack from '@/assets/icon/arrow-back.svg';

const route = useRouter();
const countryIndex = ref(null); 
const jsonData = ref(null);
const countryData = ref(null);
const store = useStore();
const isDarkMode = computed(() => store.state.isDarkMode);

const handleDarkModeChange = () => {
  console.log(`Dark Mode Toggled: ${isDarkMode.value ? 'On' : 'Off'}`);
};

onMounted(async () => {
    const { index } = route.currentRoute.value.params; // Ambil indeks dari URL
    countryIndex.value = parseInt(index); // Pastikan itu berupa angka

    try {
        // Lakukan pemfilteran data jika diperlukan
        const response = await fetch('/src/assets/api/data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        jsonData.value = data;

        if (jsonData.value) {
            // Lakukan validasi apakah indeks ada dalam rentang data JSON
            if (countryIndex.value >= 0 && countryIndex.value < jsonData.value.length) {
                // Ambil detail negara berdasarkan indeks
                countryData.value = jsonData.value[countryIndex.value];
            } else {
                console.error('Invalid country index');
            }
        } else {
            console.error('JSON data is not available');
        }
    } catch (error) {
        console.error('There has been a problem with your JSON data request:', error);
    }
});

onMounted(() => {
    handleDarkModeChange();
});
</script>

<template>
    <body :style="{ background: isDarkMode ? '#202D36' : 'white' }">
        <Navbar />
        <main :style="{ background: isDarkMode ? '#202D36' : 'white' }">
            <router-link to="/">
                <div :style="{ background: isDarkMode ? '#2B3743' : 'white' }" class="btn-back">
                    <button>
                        <div class="back-image">
                            <img :src="isDarkMode ? darkModeBack : lightModeBack" alt="">
                        </div>
                        <a :style="{ color: isDarkMode ? 'white' : 'black' }">Back</a>
                    </button>
                </div>
            </router-link>
            <div class="country-wrapper" v-if="countryData">
                <div class="country">
                    <div class="country-image">
                        <img :src="countryData.flag" :alt="countryData.name">
                    </div>
                    <div class="country-info">
                        <h2 :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.name }}</h2>
                        <div class="country-info-wrapper">
                            <div class="country-info-left">
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Native Name: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.nativeName }}</span></p>
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Population: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.population }}</span></p>
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Region: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.region }}</span></p>
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Sub Region: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.subregion }}</span></p>
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Capital: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.capital }}</span></p>
                            </div>
                            <div class="country-info-right">
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Top Level Domain: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.topLevelDomain[0] }}</span></p>
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Currencies: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.currencies[0].name }}</span></p>
                                <p :style="{ color: isDarkMode ? 'white' : 'black' }">Languages: <span :style="{ color: isDarkMode ? 'white' : 'black' }">{{ countryData.languages.map(lang => lang.name).join(', ') }}</span></p>
                            </div>
                        </div>
                        <div class="country-border" v-if="countryData.borders && countryData.borders.length > 0">
                            <p :style="{ color: isDarkMode ? 'white' : 'black' }">Border Countries: </p>
                            <div :style="{ background: isDarkMode ? '#2B3743' : 'white' }" class="borders-span">
                                <span :style="{ color: isDarkMode ? 'white' : 'black' }" v-for="(border, index) in countryData.borders" :key="index">
                                    {{ border }}{{ index < countryData.borders.length - 1 ? ', ' : '' }}
                                </span>
                            </div>
                        </div>                                               
                    </div>
                </div>
            </div>
        </main>
    </body>
</template>


<style scoped>
body {
    background-color: white;
}

main {
    padding: 2rem 5rem;
    background-color: #FAFAFA;
    height: 100%;
}

a {
    text-decoration: none;
}

.btn-back {
    width: 10%;
    height: fit-content;
    margin-top: 2rem;
    margin-bottom: 2rem;
    border-radius: 5px;
    box-shadow: rgba(65, 65, 65, 0.3) 0px 2px 8px 0px;
    background-color: white;
}

.btn-back button {
    width: 100%;
    height: 50px;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    justify-content: center;
}

.btn-back button a {
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: #000;
}

.btn-back button .back-image {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
}

.btn-back button .back-image img {
    width: 100%;
    height: 100%;
}

.country-wrapper {
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.country {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0rem;
}

.country-image {
    width: 600px;
    height: 400px;
    object-fit: cover;
    border: 1px solid rgba(99, 99, 99, 0.1);
}

.country-image img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.country-info {
    width: 40%;
    height: 100%;
    padding: 1rem;
    margin-bottom: 0;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    display: flex;
    flex-direction: column;
}

.country-info h2 {
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #000;
}

.country-info-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
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

.country-info-right {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.country-info-right p {
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    color: #000;
    margin-bottom: 0.5rem;
}

.country-info-right p span {
    font-family: 'Raleway', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    color: #000;
}

.country-border {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.country-border p {
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    color: #000;
}

.country-border .borders-span {
    width: fit-content;
    height: 30px;
    display: flex;
    align-items: center;
    margin-left: 1rem;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
    border: 1px solid rgba(99, 99, 99, 0.1);
}

.country-border .borders-span span {
    font-family: 'Raleway', sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    color: #000;
}

@media (max-width: 768px) {
    main {
        padding: 2rem;
    }

    .btn-back {
        width: 40%;
        padding: 0;
        margin: 0;
    }

    .country {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin: 2rem 0rem;
    }

    .country-image {
        width: 100%;
        height: 100%;
        border: 1px solid rgba(99, 99, 99, 0.1);
    }

    .country-image img {
        width: 100%;
        height: 100%;
    }

    .country-info {
        width: 100%;
        height: 100%;
        padding: 0rem;
        padding-top: 2rem;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
    }

    .country-info h2 {
        font-family: 'Raleway', sans-serif;
        font-weight: bold;
        font-size: 1.5rem;
        margin-bottom: 2rem;
        color: #000;
    }

    .country-info-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }

    .country-info-left {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

    .country-info-left p {
        font-family: 'Raleway', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        color: #000;
        margin-bottom: 1rem;
    }

    .country-info-left p span {
        font-family: 'Raleway', sans-serif;
        font-weight: 500;
        font-size: 0.9rem;
        color: #000;
    }

    .country-info-right {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

    .country-info-right p {
        font-family: 'Raleway', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        color: #000;
        margin-bottom: 1rem;
    }

    .country-info-right p span {
        font-family: 'Raleway', sans-serif;
        font-weight: 500;
        font-size: 0.9rem;
        color: #000;
    }

    .country-border {
        display: flex;
        flex-direction: column;
    }

    .country-border p {
        width: 100%;
        font-family: 'Raleway', sans-serif;
        font-weight: 600;
        font-size: 1rem;
        color: #000;
        margin-bottom: 1rem;
    }

    .country-border .borders-span {
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        margin-left: 0;
        padding: 1rem;
        border-radius: 5px;
        box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
        border: 1px solid rgba(99, 99, 99, 0.1);
    }
}
</style>