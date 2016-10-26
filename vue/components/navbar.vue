<template>
<div id="navbar">
    <ul class="list-group">
        <router-link :to="{name: 'home'}"><span class="icon-home3"></span></router-link>
        <router-link :to="{name: 'feeds'}"><span class="icon-folder"></span></router-link>
        <router-link :to="{name: 'mark'}"><span class="icon-star-full"></span></router-link>
        <router-link :to="{name: 'home'}"><span class="icon-user"></span></router-link>
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
    background-color: #fff;
    z-index: 1;
    a {
        box-sizing: border-box;
        text-align: center;
        padding: 8px 0;
        color: #616161;
        font-family: 'icomoon' !important;
        width: 25%;
        float: left;
        border-right: 1px solid #eee;
        font-size: 17px;
        &:last-child {
            border-right: 0;
        }
        &:hover {
            text-decoration: none;
        }
    }
}
</style>