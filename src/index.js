import './styles.css';

import { renderCards } from './modules/domModule';
import { initializeLocalStorage } from './modules/dataModule';

initializeLocalStorage();
renderCards();