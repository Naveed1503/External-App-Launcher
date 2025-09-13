<template>
  <div class="widget">
    <!-- Authentication -->
    <div v-if="!isAuthenticated" class="login-screen">
      <h2> Login Required</h2>
      <p>Please log in to access the App Launcher.</p>
      <button @click="loginWithOAuth" class="login-btn">Login with OAuth</button>
    </div>
  
    <!-- Main App Launcher -->
    <div v-else>
      <div class="header-bar">
        <h2>External App Launcher</h2>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>

      <!-- App Grid -->
      <div class="apps">
        <div v-for="(app, index) in apps" :key="index" class="app-tile">
          <img :src="app.icon || defaultIcon" alt="icon" class="icon" />
          <p>{{ app.name }}</p>
          <div class="actions">
            <button @click="openApp(app)">Open</button>
            <button class="edit" @click="editApp(index)">Edit</button>
            <button class="remove" @click="removeApp(index)">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Settings Panel Toggle -->
      <div class="settings-panel">
        <button class="settings-btn" @click="toggleSettings">
        {{ showSettings ? 'Close App Settings' : 'Open App Settings' }}
        </button>


        <!-- Settings Form -->
        <div v-if="showSettings" class="settings-form">
          <h3>{{ editIndex !== null ? 'Edit App' : 'Add New App' }}</h3>
          <input v-model="newApp.name" placeholder="App Name" />
          <input v-model="newApp.url" placeholder="App URL (https://...)" />
          <input v-model="newApp.icon" placeholder="Icon URL" />

          <label>
            <input type="radio" value="iframe" v-model="newApp.mode" /> Open in iFrame
          </label>
          <label>
            <input type="radio" value="newtab" v-model="newApp.mode" /> Open in New Tab
          </label>

          <button class="save" @click="saveApp">
            {{ editIndex !== null ? 'Update App' : 'Add App' }}
          </button>
          <button v-if="editIndex !== null" class="cancel" @click="cancelEdit">Cancel</button>
        </div>
      </div>

      <!-- iFrame Preview -->
      <div v-if="selectedUrl && selectedMode === 'iframe'" class="iframe-container">
        <iframe
          :src="selectedUrl"
          sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
        <button class="close" @click="closeIframe">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import './style.css'

const defaultIcon = "https://cdn-icons-png.flaticon.com/512/565/565547.png"

const apps = ref([])
const newApp = ref({ name: "", url: "", icon: "", mode: "iframe" })
const selectedUrl = ref(null)
const selectedMode = ref("iframe")
const showSettings = ref(false)
const editIndex = ref(null)
const isAuthenticated = ref(false)
const authToken = ref(null)

// Load auth + apps from localStorage
onMounted(() => {
  const savedToken = localStorage.getItem("authToken")
  if (savedToken) {
    isAuthenticated.value = true
    authToken.value = savedToken
  }

  const savedApps = localStorage.getItem("apps")
  if (savedApps) {
    apps.value = JSON.parse(savedApps)
  }

  // Handle OAuth redirect (?token=...)
  const params = new URLSearchParams(window.location.search)
  if (params.has('token')) {
    const token = params.get('token')
    localStorage.setItem('authToken', token)
    isAuthenticated.value = true
    authToken.value = token
    window.history.replaceState({}, document.title, window.location.pathname)
  }
})

// Persist apps
watch(apps, (newVal) => {
  localStorage.setItem("apps", JSON.stringify(newVal))
}, { deep: true })

// Auth
function loginWithOAuth() {
  window.location.href = "http://localhost:3000/auth/login"
}
function logout() {
  localStorage.removeItem("authToken")
  isAuthenticated.value = false
  authToken.value = null
}

// URL validation
function isValidUrl(url) {
  try {
    const parsed = new URL(url)
    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Toggle settings
function toggleSettings() {
  showSettings.value = !showSettings.value
  if (!showSettings.value) cancelEdit()
}

// Save app
function saveApp() {
  if (!newApp.value.name || !isValidUrl(newApp.value.url)) {
    alert("Please enter a valid name and URL (https://...)")
    return
  }

  if (editIndex.value !== null) {
    apps.value[editIndex.value] = { ...newApp.value }
  } else {
    apps.value.push({ ...newApp.value })
  }

  if (newApp.value.mode === "iframe") {
    selectedUrl.value = newApp.value.url
    selectedMode.value = "iframe"
  } else {
    window.open(newApp.value.url, "_blank")
  }

  cancelEdit()
  showSettings.value = false
}

// Edit app
function editApp(index) {
  newApp.value = { ...apps.value[index] }
  editIndex.value = index
  showSettings.value = true
}

// Cancel edit
function cancelEdit() {
  newApp.value = { name: "", url: "", icon: "", mode: "iframe" }
  editIndex.value = null
}

// Remove app
function removeApp(index) {
  apps.value.splice(index, 1)
}

// Open app
function openApp(app) {
  if (!isValidUrl(app.url)) {
    alert("Invalid URL")
    return
  }
  if (app.mode === "iframe") {
    selectedUrl.value = app.url
    selectedMode.value = "iframe"
  } else {
    window.open(app.url, "_blank")
  }
}

// Close iframe
function closeIframe() {
  selectedUrl.value = null
}
</script>
