<template>
<div class="data-page" v-if="!showPoster">
	<div class="container">
		<h1>簡訊實聯制海報產生器</h1>
		<div class="texts">
			<p>使用說明：</p>
			<p>① 請先至<a href="https://emask.taiwan.gov.tw/real/?fbclid=IwAR2EhCyHnQKXrEozNYvDdDBQkMdHTnQ4IJyEAF3BvR8ut3HcqSYHUJqBf3A" target="_blank">簡訊實聯制 QR Code登記作業</a>申請場所代碼</p>
			<p>② 請輸入正確的場所名稱、場所代碼</p>
			<p>③ 按下產生海報按鈕，即可列印實聯制海報</p>
		</div>
		<label class="data-item" for="name">
			<span>場所名稱 : </span>
			<input id="name" v-model="name" />
			<span class="wrong" v-if="nameState !== ''">{{nameState}}</span>
		</label>
		<label class="data-item" for="id">
			<span>場所代碼 : </span>
			<input id="id" v-model="formatId" maxlength="18" @keypress="isNumber($event)" />
			<span class="wrong" v-if="idState !== ''">{{idState}}</span>
		</label>
		<button @click="openPoster">產生海報</button>
	</div>
</div>
<div class="poster-page" v-if="showPoster">
	<picture>
		<source srcset="./assets/bg.webp" type="image/webp">
		<img @load="imgOnLoad" id="poster-page-bg" src="./assets/bg.png" alt="實聯制海報背景">
	</picture>
	<img id="qrcode" v-if="qrcodeUrl !== ''" :src="qrcodeUrl" alt="">
	<p id="poster-name">{{name}}</p>
	<p id="poster-id">{{id}}</p>
	<div v-show="showAlert" class="alert">
		<p>若誤關列印畫面，可按鍵盤快速鍵進行列印。</p>
		<p>Mac: ⌘ + p</p>
		<p>Windows & Linux: Ctrl + p</p>
		<div class="close" @click="closeAlert">x</div>
	</div>
</div>

</template>

<script>
import { ref, computed } from 'vue';

export default {
name: 'App',
setup() {
	const name = ref('');
	const id = ref('');
	const showPoster = ref(false);
	const qrcodeUrl = ref('')
	const idState = ref('');
	const nameState = ref('');
	const showAlert = ref(false);
	const closeAlert = () => {
		showAlert.value = false;
	}
	const formatId = computed({
		get: () => id.value,
		set: (val) => {id.value = val.replace(/[^0-9.]/g,'').replace(/(.{4})/g,'$1 ').replace(/ $/g,'')}
	})
	const imgOnLoad = () => {
		window.print();
		showAlert.value = true;
	}
	const openPoster = () => {
		const dataIsCorrect = checkData();
		if (!dataIsCorrect) return
		getQrcodeUrl();
		showPoster.value = true;
	}
	const checkData = () => {
		nameState.value = '';
		idState.value = '';

		if (name.value === '') nameState.value = '請填寫場所名稱!';
		if (id.value.length !== 18) idState.value = '場所代碼長度有誤!';
		if (nameState.value !== '' || idState.value !== '') {
			return false
		} else {
			return true
		}
	}
	const getQrcodeUrl = () => {
		const text = `SMSTO:1922:場所名稱：${name.value} \n場所代碼：${id.value} \n本簡訊是簡訊實聯制發送，限防疫目的使用。`;
		dataToQrcodeUrl(text)
	}
	const dataToQrcodeUrl = (text) => {
		const QRCode = require('qrcode');
		// 容錯率 L < M < Q < H
		const opts = {
			errorCorrectionLevel: 'M',
			version: 10,
			width: 600,
			margin: 5,
			color: {
				dark: '#333',
				light: '#fff'
			}
		};
		QRCode.toDataURL(text, opts, (err, url) => {
			if (err) throw err
			qrcodeUrl.value = url
		});
	};
	const isNumber = (evt) => {
      evt = (evt) ? evt : window.event;
      let charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
	
	return {
		name,
		id,
		openPoster,
		showPoster,
		qrcodeUrl,
		formatId,
		nameState,
		idState,
		closeAlert,
		showAlert,
		imgOnLoad,
		isNumber
	}
}
}
</script>

<style>
body, html {
	padding: 0;
	margin: 0;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #fff;
}
.alert {
	position: absolute;
	background-color: rgba(255, 255, 255, 0.8);
	box-shadow: 0 0 20px #333;
	color: #333;
	border-radius: 5px;
	right: 35px;
	top: 15px;
	padding: 1rem;
	z-index: 999;
}
.alert p {
	margin: 0;
}
.close {
	position: absolute;
	right: -5px;
	top: -5px;
	background-color: #fff;
	color: #333;
	font-size: 16px;
	line-height: 14px;
	width: 16px;
	height: 16px;
	text-align: center;
	border-radius: 100%;
	cursor: pointer;
}
.wrong {
	color: tomato;
	margin-left: 10px;
}
.data-page {
	background-color: #393635;
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 16px;
}
button {
	background-color: transparent;
	outline: none;
	border: 1.5px solid #ffff7f;
	padding: .75rem 2.5rem;
	color: #ffff7f;
	font-size: 18px;
	font-weight: 500;
	border-radius: 10px;
	margin-top: 1.25rem;
	cursor: pointer;
	transition: 0.5s;
}
button:hover {
	background-color: #ffff7f;
	color: #393635;
}
a {
	font-size: 16px;
	text-decoration: none;
	color: #ffff7f;
	transition: 0.5s
}
a:hover {
	opacity: 0.8;
}
.texts {
	margin-bottom: 2rem;
}
.texts p {
	margin: .25rem;
}
.data-item {
	margin-bottom: 1rem;
	display: block;
}
.data-item input {
	margin-left: 10px;
	padding: 5px;
	min-width: 200px;
}
.poster-page {
	width: 930px;
    padding: 0px;
    margin-left: auto;
    margin-right: auto;
    z-index: 1;
	position: relative;
}
#poster-page-bg {
	width: 100%;
}
#qrcode {
	position: absolute;
    z-index: 11;
    width: 399px;
    height: 399px;
    top: 342px;
    left: 265px;
}
#poster-id, #poster-name {
	position: absolute;
    z-index: 11;
	letter-spacing: 1px;
	font-size: 26px;
    top: 745px;
    left: 408px;
	opacity: 0.95;
}
#poster-id {
	top: 792px;
}
</style>
