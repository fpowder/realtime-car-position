import { Vector3 } from 'three';

const data2 = [[167, 1140],[184, 1062],[161, 1123]];
let data = [1, 2, 1, 2, 3, 4, 5, 1, 2, 9, 10, 11, 2, 3, 5, 6, 1, 2, 10, 2, 3, 30];
let checked = [];

function closeFilter() {
    let result = [];
    outer: for(let i = 0; i < data.length; i++) {
        const each = data[i];

        for(let j = i + 1; j < data.length; j++) {
            if(each === data[j]) continue outer;
        }
        result.push(each);
    }
    console.log(result);

}

closeFilter();



console.log(data2.includes([167,0,1140]));