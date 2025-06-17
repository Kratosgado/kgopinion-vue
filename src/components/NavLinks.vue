<template>
  <li aria-label="home">
    <RouterLink to="/home" :class="$route.path === '/home' && 'bg-primary'">Home</RouterLink>
  </li>
  <li aria-label="articles">
    <RouterLink to="/articles" :class="$route.path === '/articles' && 'bg-primary'"
      >Articles</RouterLink
    >
  </li>
  <li aria-label="categories">
    <RouterLink
      to="/articles/categories"
      :class="$route.path === '/articles/categories' && 'bg-primary'"
    >
      Categories</RouterLink
    >
  </li>
  <li aria-label="about">
    <RouterLink to="/about" :class="$route.path === '/about' && 'bg-primary'">About</RouterLink>
  </li>
  <li aria-label="contact">
    <RouterLink to="/contact" :class="$route.path === '/contact' && 'bg-primary'"
      >Contact</RouterLink
    >
  </li>
</template>
