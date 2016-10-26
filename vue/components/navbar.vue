<template>
<div id="navbar">
    <ul class="list-group">
        <router-link :to="{name: 'home'}"><span class="icon-home3"><small>未读</small></span></router-link>
        <router-link :to="{name: 'feeds'}"><span class="icon-folder"><small>订阅源</small></span></router-link>
        <router-link :to="{name: 'mark'}"><span class="icon-star-full"><small>收藏</small></span></router-link>
        <router-link :to="{name: 'home'}"><span class="icon-pacman"><small>广场</small></span></router-link>
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
        color: #616161;
        font-family: 'icomoon' !important;
        width: 25%;
        float: left;
        border-right: 1px solid #eee;
        padding: 5px 15px;
        &:last-child {
            border-right: 0;
        }
        &:hover {
            text-decoration: none;
        }
    }
    span small {
        display: block;
        width:100%;
        font-size: 12px !important;
        line-height: 1;
    }
}
</style>