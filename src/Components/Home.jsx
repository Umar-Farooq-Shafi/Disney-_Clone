import React from 'react'

import {
    useSelector,
    useDispatch
} from 'react-redux'

import styled from 'styled-components';

import {
    setMovies
} from '../features/movie/movieSlice';
import {
    selectUserName
} from '../features/user/userSlice';
import db from '../firebase';

import ImgSlider from './ImgSlider'
import NewDisney from './NewDisney'
import Originals from './Originals'
import Recommends from './Recommends'
import Trending from './Trending'
import Viewers from './Viewers'

export default function Home() {
    const userName = useSelector(selectUserName);
    const dispatch = useDispatch();

    const [recommends, setRec] = React.useState([]);
    const [originals, setOrig] = React.useState([]);
    const [newDisney, setND] = React.useState([]);
    const [trending, setTrend] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, [userName]);

    const getData = () => {
        db.collection("movies")
            .onSnapshot((snap) => {
                snap.docs.map((doc) => {
                    switch (doc.data().type) {
                        case "recommend":
                            setRec([...recommends, {
                                id: doc.id,
                                ...doc.data()
                            }]);
                            break;

                        case "new":
                            setND([...newDisney, {
                                id: doc.id,
                                ...doc.data()
                            }]);
                            break;

                        case "original":
                            setOrig([...originals, {
                                id: doc.id,
                                ...doc.data()
                            }])
                            break;

                        default:
                            setTrend([...trending, {
                                id: doc.id,
                                ...doc.data()
                            }])
                            break;
                    }
                    return '';
                })
            });

        dispatch(setMovies({
            recommend: recommends,
            newDisney: newDisney,
            original: originals,
            trending: trending
        }));

        setTimeout(() => {
            if (recommends.length === 0 || newDisney=== 0  || originals=== 0  || trending=== 0 ) {
                getData();
            }else {
                clearTimeout();
            }
        }, 1000);
    }
    

    return (
        <Container >
            <ImgSlider />
            <Viewers />
            <Recommends />
            <NewDisney />
            <Originals />
            <Trending />
        </Container>
    )
}

const Container = styled.main`
        position: relative;
        min-height: calc(100vh - 250px);
        overflow-x: hidden;
        display: block;
        top: 72px;
        padding: 0 calc(3.5vw + 5px);

        &:after {
            background: url('/images/home-background.png');
        content: "";
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: opacity 500ms ease 0;
        z-index: -1;
    }
        `;