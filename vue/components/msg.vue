<template>
<div v-if="msgs.length">
    <div v-for="msg in msgs">
        <p>{{msg}}</p>
    </div>
</div>
</template>

<script>
export default {
    props: ['msgs']
}
</script>

<style lang="sass">

</style>