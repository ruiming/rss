<template>
<div v-if="msgs.length">
    <div v-for="msg in msgs">
        <p class="bg-danger msg">{{msg}}</p>
    </div>
</div>
</template>

<script>
export default {
    props: ['msgs']
}
</script>

<style lang="sass">
.msg {
    margin: 10px 0;
    padding: 15px;
}
</style>