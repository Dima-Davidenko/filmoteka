import { FIREBASE_CONFIG } from '../utils/envConsts';
import { firebaseApp, initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getDatabase, ref, set, remove, onValue } from 'firebase/database';
import refsMdl from './refsMdl';

export default class firebaseAPI {
  constructor(signInBtnEl, logOutBtnEl) {
    this.firebaseConfig = JSON.parse(FIREBASE_CONFIG);
    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseAuth = getAuth(firebaseApp);
    this.providerGoogle = new GoogleAuthProvider();
    this.database = getDatabase(this.firebaseApp);
    this.userStatus = refsMdl.userStatusEl;
    this.monitorAuthState();
    signInBtnEl.addEventListener('click', this.signInWithPopupGoogle.bind(this));
    logOutBtnEl.addEventListener('click', this.logout.bind(this));
  }

  async signInWithPopupGoogle() {
    try {
      const signInResult = await signInWithPopup(this.firebaseAuth, this.providerGoogle);
      // const credential = GoogleAuthProvider.credentialFromResult(signInResult);
      // const token = credential.accessToken;
      const user = signInResult.user;
      this.userId = user.uid;
      this.userStatus.textContent = 'Registered';
      console.log(user);
    } catch (error) {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
      console.log(credential);
      console.log('error');
    }
  }

  // Monitor auth state
  async monitorAuthState() {
    onAuthStateChanged(this.firebaseAuth, user => {
      if (user) {
        console.log(user);
        this.userId = user.uid;
        // showApp();
        // showLoginState(user);
        // userId = user.uid;
        // hideLoginError();
        // hideLinkError();
        const userLybrary = ref(this.database, `users/${this.userId}/lybrary/`);
        onValue(userLybrary, lybrary => {
          const data = lybrary.val();
          console.log(data);
        });
        this.userStatus.textContent = 'Registered';
      } else {
        this.userStatus.textContent = 'Logged Out';
        console.log(`You're not logged in.`);
      }
    });
  }

  // Log out
  async logout() {
    try {
      await signOut(this.firebaseAuth);
      this.userStatus.textContent = 'Logged Out';
    } catch (error) {
      console.log(error);
    }
  }

  async addToWatched(movieInfo) {
    set(ref(this.database, `users/${this.userId}/lybrary/watched/${movieInfo.filmId}`), {
      filmId: movieInfo.filmId,
      movieName: movieInfo.movieName,
      posterUrl: movieInfo.posterUrl,
      genres: movieInfo.genres,
      year: movieInfo.year,
    });
  }

  async addToQueued(movieInfo) {
    set(ref(this.database, `users/${this.userId}/lybrary/queued/${movieInfo.filmId}`), {
      filmId: movieInfo.filmId,
      movieName: movieInfo.movieName,
      posterUrl: movieInfo.posterUrl,
      genres: movieInfo.genres,
      year: movieInfo.year,
    });
  }

  async removeFromWatched(movieId) {
    remove(ref(this.database, `users/${this.userId}/watched/${movieId}`));
  }
}
