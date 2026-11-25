import { Modal } from "./Modal";

export function ProfileModal({ user, onOpenFavs, onLogout, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2>Профиль</h2>
      <dl className="dl">
        <div>
          <dt>Логин</dt>
          <dd>{user.login}</dd>
        </div>
        <div>
          <dt>Почта</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>В избранном</dt>
          <dd>{user.favs.length}</dd>
        </div>
      </dl>
      <div className="row">
        <button className="btn" onClick={onOpenFavs}>
          Открыть избранное
        </button>
        <button className="btn ghost" onClick={onLogout}>
          Выйти
        </button>
      </div>
    </Modal>
  );
}