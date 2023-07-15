import { of, filter, map, scan, fromEvent, throttleTime ,debounceTime} from 'rxjs';

of(1, 2, 3)
    .pipe(map(x => x * x))
    .pipe(filter(x => x % 2 !== 0))
    .subscribe(v => console.log(`value:${v}`));



const numbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
numbers$.pipe(
    // scan((total, n) => total + n),
    scan((total, n)=> {
        console.log('--------------------',total,n);
        return total + n
    },0),
    map((sum, index) => sum / (index + 1))
)
    .subscribe(console.log);
    // scan 是计数，map 是转换

    // 防抖和节流

    const clicks = fromEvent(document,'click')
    const result = clicks.pipe(throttleTime(1000))
    result.subscribe(x => console.log(x));


const clicks = fromEvent(document, 'click');
const result = clicks.pipe(debounceTime(1000));
result.subscribe(x => console.log(x));