import * as React from 'react'
import * as s from './styles.scss'
const logoImage = require('assets/images/logo.svg')

class Footer extends React.Component {
  render() {
    return (
    <footer className={s['footer']}>

      <main>
        <section className={s['contacts']}>
          <div className={s['contacts__logo']}>
            <img src={logoImage} alt="satori" />
          </div>
          <address className={s['contacts__details']}>
            <header>
              <h1>SATORI HQ</h1>
            </header>
            <p>740 Heinz Av</p>
            <p>Berkeley, CA 94710</p>
            <p>California, USA</p>
          </address>
        </section>

        <section className={s['navigation']}>
          <nav className={s['navigation__subsection']}>
            <header>
              <h1>LINKS</h1>
            </header>
            <ul>
              <li><a href="#">Satori Kore</a></li>
              <li><a href="#">Technology</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </nav>
          <nav className={s['navigation__subsection']}>
            <header>
              <h1>APPLICATION</h1>
            </header>
            <ul>
              <li><a href="#">Agriculture</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Military</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </nav>
          <nav className={s['navigation__subsection']}>
            <header>
              <h1>ABOUT</h1>
            </header>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </nav>
        </section>

        <section className={s['newsletter']}>
          <header>
            <h1>Subscribe to<br />our newsletter</h1>
          </header>
          <form className={s['form-newsletter']}>
            <input placeholder="name" />
            <div className={s['form-newsletter__submit-container']}>
              <input placeholder="email" />
              <button type="submit">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </form>
        </section>

        <section className={s['copyrights-and-social-links']}>
          <p className={s['copyright_owner']}>
              <span>© SATORI</span>
              <span>2018.</span>
          </p>

          <p className={s['created_by']}>
            <span>Designed and built by </span>
            <a href="#">FIFTYSEVEN</a>
          </p>

          <nav className={s['social-links']}>
              <a href="#facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#twitter"><i className="fab fa-twitter"></i></a>
              <a href="#linkedin"><i className="fab fa-linkedin-in"></i></a>
          </nav>
        </section>
      </main>

    </footer>
  ); }
}

export default Footer;
