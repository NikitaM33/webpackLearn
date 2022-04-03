import './babel';
import * as $ from 'jquery';
import Post from '@models/Post';
import json from './assets/json.json';
import myImg from './assets/eb60bc8a48a3e05188bae3af_rw_1920.jpg';
import './styles/styles.css';
import './styles/sass.scss';

// const post = new Post('Новая статья', myImg);

// $('pre').addClass('code').html(post.toString());

// console.log('Post to string', post.toString());
// console.log('This is JSON', json);

window.addEventListener('load', function () {
    const selected = document.querySelector('.selected');
    const optionContainer = document.querySelector('.optionContainer');
    const optionList = document.querySelectorAll('.option');

    const selectHandler = () => {
        optionContainer.classList.toggle('active')
    }

    selected.addEventListener('click', selectHandler);

    optionList.forEach((item) => {
        item.addEventListener('click', () => {
            selected.innerHTML = item.querySelector('label').innerHTML;
            optionContainer.classList.remove('active')
        });
    });
});
