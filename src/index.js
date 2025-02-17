import './styles.css';

import { cardManagement } from './modules/domModule';
import { dataManagement } from './modules/dataModule';

dataManagement().initializeLocalStorage();
cardManagement().renderCards();

console.log('x');