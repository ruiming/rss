<template>
<div id="navbar">
    <ul class="list-group">
        <router-link :to="{name: 'home'}" >首页</router-link>
        <router-link :to="{name: 'feeds'}" >订阅源</router-link>
        <router-link :to="{name: 'mark'}" >星标文章</router-link>
        <router-link :to="{name: 'home'}" >我</router-link>
    </ul>
</div>
</template>

<script type="babel">
export default {

}
</script>

<style lang="sass">
#navbar ul {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    list-style: none;
    padding: 0;
    margin: 0;
    border-top: 1px solid #eee;
    font-weight: 500;
    background-color: white;
    z-index: 1;
    a {
        box-sizing: border-box;
        text-align: center;
        padding: 10px 0;
        color: #333;
        width: 25%;
        float: left;
        border-right: 1px solid #eee;
        &:last-child {
            border-right: 0;
        }
        &:hover {
            text-decoration: none;
        }
    }
}
</style>