<template>
<div class="empty">
    <span class="icon-rss"></span>
    <small>
        <slot>空空如也</slot>
    </small>
</div>
</template>

<script>
export default {

}
</script>

<style>
.empty {
    padding: 50% 0;
    span {
        display: block;
        font-size: 100px;
        color: #ddd;
        width: 100%;
        text-align: center;
    }
    small {
        margin: 15px 0;
        color: #777;
        display: block;
        width: 100%;
        text-align: center;
    }
}
</style>