import { useSelector } from "react-redux"
import { login } from "../store/actions/user.actions"
import { useNavigate } from "react-router"

import homepageImage from '../assets/imgs/homepage.png'

export function HomePage() {
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    async function onSignIn() {
        try {
            await login({ username: 'Guest', password: '1234' })
            navigate('/board')
        } catch (err) {
            console.log('error logging in:', err)
        }
    }
    return (
        <section className="homepage-container">
            <section className="homepage-first">
                <div className="container">
                    <div className="left-container">
                        <div className="text-block">
                            <div>
                                <h1>Trellife brings all your tasks, teammates, and tools together</h1>
                                <p>Keep everything in the same place—even if your team isn’t.</p>
                            </div>
                            <div className="spacer"></div>
                        </div>
                        <div className="homepage-get-started">
                            {/* <input type="email" name="" id="" /> */}
                            <button onClick={onSignIn}>Start demo</button>
                        </div>
                    </div>
                    <div className="right-container">
                        <img src={homepageImage} alt="" />
                    </div>
                </div>
            </section>
            <section className="homepage-second">
                <div className="header">
                    <div className="inner-header">
                        <div className="text-block">
                            <div className="text-title">
                                <p className="trellife-101">Trellife 101</p>
                                <p className="subtitle">A productivity powerhouse</p>
                            </div>
                            <div className="text-content">
                                <p>Simple, flexible, and powerful.
                                    All it takes are boards, lists,
                                    and cards to get a clear view of who’s doing what and what needs to get done.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div id="carouselExampleControlsNoTouching" class="carousel slide" data-bs-touch="false">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="../../../src/assets/imgs/board-details-screenshot.png" class="d-block w-100" alt="..." />
                        </div>
                        <div class="carousel-item">
                            <img src="../../../src/assets/imgs/drag-and-drop-screenshot.png" class="d-block w-100" alt="..." />
                        </div>
                        <div class="carousel-item">
                            <img src="..." class="d-block w-100" alt="..."/>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div> */}
            </section>
        </section >
    )
}

