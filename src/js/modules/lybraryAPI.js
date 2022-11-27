import storageAPI from './storageAPI';
import { firebaseInstance } from '../main';

function lybBtnClickAction(e) {
  if (e.target.dataset.action === 'add') {
    addToLyb(+e.target.dataset.id, e.target.dataset.type);
  } else {
    removeFromLyb(+e.target.dataset.id, e.target.dataset.type);
  }
}

function addToLyb(id, type) {
  const lyb = storageAPI.load(type) || [];
  if (lyb.find(info => info?.id === id)) return;
  const movieInfo = storageAPI.load('modalInfo');
  lyb.push(movieInfo);
  storageAPI.save(type, lyb);
}

function removeFromLyb(id, type) {
  const lyb = storageAPI.load(type) || [];
  lyb.splice(
    lyb.findIndex(info => info?.id === id),
    1
  );
  storageAPI.save(type, lyb);
}

export default {
  lybBtnClickAction,
};
