export default function translateCategory(data){
switch (data){
    case 'zp': return 'зарплата';
    case 'transport': return 'транспорт';
    case 'jkh': return 'жкх';
    case 'food': return 'питание';
    case 'fun': return 'развлечения';
    case 'another': return 'другое';
    case 'mining': return 'майнинг';
    case 'vzyatka': return 'взятка'
    default: return 'ну я хз че это'
}


}