<template>
  <div class="p-4">
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Пошук..."
        class="mb-4 p-2 border border-gray-300 rounded w-full"
    />

    <table class="min-w-full border border-gray-300 text-sm table-fixed">
      <thead class="bg-gray-600 text-white">
      <tr>
        <th
            v-for="(label, field) in columns"
            :key="field"
            @click="sortBy(field)"
            class="px-3 py-2 text-left cursor-pointer"
        >
          <span>{{ label }}</span>
          <span v-if="sortField === field">
              {{ sortAsc ? '▲' : '▼' }}
            </span>
        </th>
        <th class="w-[110px] px-3 py-2 text-left">Фото</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="product in paginatedProducts"
          :key="product.id"
          class="border-t border-gray-300"
      >
        <td class="w-[150px] px-3 py-2">{{ product.title }}</td>
        <td class="w-[250px] px-3 py-2">{{ product.description }}</td>
        <td class="w-[100px] px-3 py-2">${{ product.price }}</td>
        <td
            class="w-[80px] px-3 py-2 font-semibold"
            :class="product.rating < 4.5 ? 'text-red-500' : 'text-green-600'"
        >
          {{ product.rating }}
        </td>
        <td class="w-[120px] px-3 py-2">{{ product.brand }}</td>
        <td class="w-[120px] px-3 py-2">{{ product.category }}</td>
        <td class="w-[110px] px-3 py-2">
          <img
              :src="product.thumbnail"
              alt="thumb"
              class="w-[100px] h-[100px] object-cover rounded"
          />
        </td>
      </tr>
      </tbody>
    </table>

    <div class="mt-4 flex justify-center gap-2">
      <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="px-3 py-1 border rounded"
          :class="page === currentPage ? 'bg-gray-600 text-white' : 'bg-white text-black'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const products = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 5
const sortField = ref('')
const sortAsc = ref(true)

// Назви колонок
const columns = {
  title: 'Назва',
  description: 'Опис',
  price: 'Ціна',
  rating: 'Оцінка',
  brand: 'Бренд',
  category: 'Категорія'
}

async function fetchProducts() {
  try {
    const res = await fetch('https://dummyjson.com/products')
    const json = await res.json()
    products.value = json.products || []
  } catch (error) {
    console.error('Помилка при завантаженні продуктів:', error)
  }
}

onMounted(() => {
  fetchProducts()
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(p =>
      Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  )
})

const sortedProducts = computed(() => {
  if (!sortField.value) return filteredProducts.value
  return [...filteredProducts.value].sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    return sortAsc.value
        ? aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        : aVal < bVal ? 1 : aVal > bVal ? -1 : 0
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sortedProducts.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
    Math.ceil(sortedProducts.value.length / perPage)
)

function sortBy(field) {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value
  } else {
    sortField.value = field
    sortAsc.value = true
  }
  currentPage.value = 1
}
</script>

