import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import { auth, provider } from '../firebase';
import { selectUserName, setUserLoginDetails, selectUserPhoto, setSignOutState } from '../features/user/userSlice';

export default function Header() {
    const dispatch = useDispatch();
    const history = useHistory();
    const username = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);

    React.useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                history.push('/home');
            }
        })
    }, [username]);

    const handleAuth = () => {
        if (!username) {
            auth.signInWithPopup(provider)
                .then(res => {
                    setUser(res.user);
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (username) {
            auth.signOut()
                .then(() => {
                    dispatch(setSignOutState());
                    history.push("/");
                })
                .catch(err => console.log(err));
        }
    };

    const setUser = (user) => {
        dispatch(setUserLoginDetails({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL
        }))
    }

    return (
        <Nav>
            <Logo>
                <img src="/images/logo.svg" alt="logo" />
            </Logo>
            {
                !username ?
                    <Login onClick={handleAuth}>Login</Login>
                    :
                    <>
                        <NavMenu>
                            <Link to="/home">
                                <img src="/images/home-icon.svg" alt="home-icon" />
                                <span>HOME</span>
                            </Link>
                            <Link to="#">
                                <img src="/images/search-icon.svg" alt="search-icon" />
                                <span>SEARCH</span>
                            </Link>
                            <Link to="#">
                                <img src="/images/watchlist-icon.svg" alt="watchlist-icon" />
                                <span>WATCHLIST</span>
                            </Link>
                            <Link to="#">
                                <img src="/images/original-icon.svg" alt="original-icon" />
                                <span>ORIGINALS</span>
                            </Link>
                            <Link to="#">
                                <img src="/images/movie-icon.svg" alt="movie-icon" />
                                <span>MOVIES</span>
                            </Link>
                            <Link to="#">
                                <img src="/images/series-icon.svg" alt="series-icon" />
                                <span>SERIES</span>
                            </Link>
                        </NavMenu>
                        <SignOut>
                            <UserImg src={userPhoto} alt={username} />
                            <DropDown>
                                <span onClick={handleAuth}>Sign Out</span>
                            </DropDown>
                        </SignOut>
                    </>
            }
        </Nav>
    )
}

const Nav = styled.nav`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 70px;
    background-color: #090b13;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 36px;
    transition: opacity 0.5s ease-out;
    letter-spacing: 16px;
    z-index: 3;
`;

const Logo = styled.a`
    padding: 0;
    width: 80px;
    margin-top: 4px;
    max-height: 70px;
    transition: all 0.2s ease 0s;
    font-size: 0;
    display: inline-block;

    img {
        display: block;
        width: 100%;
    }
`;

const NavMenu = styled.div`
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
    position: relative;
    margin-right: auto;
    margin-left: 20px;

    a {
        display: flex;
        align-items: center;
        padding: 0 12px;

        img {
            height: 20px;
            min-height: 20px;
            width: 20px;
            z-index: auto;
        }

        span {
            color: rgb(249, 249, 249);
            font-size: 13px;
            letter-spacing: 1.4px;
            line-height: 1.08;
            margin-left: 8px;
            padding: 2px 0;
            white-space: nowrap;
            position: relative;

            &:before {
                background-color: rgb(249, 249, 249);
                border-radius: 0 0 4px 4px;
                bottom: -6px;
                content: "";
                height: 2px;
                left: 0;
                opacity: 0;
                position: absolute;
                right: 0;
                transform-origin: left center;
                transform: scaleX(0);
                transition: all 250ms cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
                visibility: hidden;
                width: auto;
            }
        }

        &:hover {
            span:before {
                transform: scaleX(1);
                visibility: visible;
                opacity: 1 !important;
            }
        }
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

const Login = styled.a`
    background-color: rgba(0, 0, 0, 0.6);
    padding: 8px 16px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border: 3px solid #f9f9f9;
    border-radius: 4px;
    transition: all 0.2s ease 0;

    &:hover {
        background-color: #f9f9f9;
        color: #000;
        border-color: transparent;
    }
`;

const UserImg = styled.img`
    height: 100%;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }
`;

const DropDown = styled.div`
    position: absolute;
    top: 48px;
    right: 0px;
    background: rgb(19, 19, 19);
    border: 1px solid rgba(151, 151, 151, 0.34);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
    padding: 10px;
    font-size: 14px;
    letter-spacing: 3px;
    width: 100px;
    opacity: 0;
`;

const SignOut = styled.div`
    position: relative;
    height: 48px;
    width: 48px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    ${UserImg} {
        border-radius: 50%;
        width: 100%;
        height: 100%;
    }
    &:hover {
        ${DropDown} {
            opacity: 1;
            transition-duration: 1s;
        }
  }
`
