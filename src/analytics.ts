import * as $ from 'jquery';

const showAnalytics = (): object => {
    let clicks: number = 0;
    let isDestroyed: boolean = false;
    
    const clickCounter = (): number => {
        return clicks++;
    }

    $(document).on('click', clickCounter);

    return {
        destroy() {
            $(document).off('click', clickCounter);
            isDestroyed = true;
        },
        getClicks() {
            if (isDestroyed) {
                return 'Analytics is destroyed';
            }
            return clicks;
        }
    }
}

window['analytics'] = showAnalytics();