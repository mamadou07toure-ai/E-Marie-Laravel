import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Inertia gère nativement les erreurs 401/419 via les redirections de Laravel,
// pas besoin d'intercepteur global ici qui pourrait créer des faux positifs.
