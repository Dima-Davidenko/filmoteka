const save = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    sessionStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
};

const load = key => {
  try {
    const serializedState = sessionStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};

const remove = key => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.log('Remove item error: ', error.message);
  }
};

export default {
  save,
  load,
  remove,
};
