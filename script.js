        const APIController = (function () {
            const clientId = 'af911c09970443788f961ee3fccef436';
            const clientSecret = '11f54c75ab0943ac817bd7a95dfbd8c3';

            // private methods
            const _getToken = async () => {
                const result = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                    },
                    body: 'grant_type=client_credentials'
                });

                const data = await result.json();
                return data.access_token;
            };

            const _searchSpotify = async (token, searchTerm) => {
                const result = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                const data = await result.json();
                return data.tracks.items;
            };

            return {
                getToken: async function () {
                    return await _getToken();
                },

                searchSpotify: async function (token, searchTerm) {
                    return await _searchSpotify(token, searchTerm);
                }
            };
        })();

        document.addEventListener('DOMContentLoaded', async function () {
            const token = await APIController.getToken();
            const searchForm = document.getElementById('searchForm');
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const searchResultsContainer = document.getElementById('searchResults');
            const playerContainer = document.getElementById('playerContainer');
        
            searchButton.addEventListener('click', async function () {
                const searchTerm = searchInput.value.trim();
        
                if (searchTerm !== '') {
                    const searchResults = await APIController.searchSpotify(token, searchTerm);
                    displaySearchResults(searchResults);
                }
            });
        
            function displaySearchResults(results) {
                searchResultsContainer.innerHTML = '';
        
                if (results) {
                    results.forEach(track => {
                        const trackBox = createTrackBox(track);
                        searchResultsContainer.appendChild(trackBox);
                    });
                }
            }
        
            function createTrackBox(track) {
                const trackBox = document.createElement('div');
                trackBox.classList.add('col-md-4', 'mb-4');
        
                const card = document.createElement('div');
                card.classList.add('card');
        
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
        
                const title = document.createElement('h5');
                title.classList.add('card-title');
                title.textContent = track.name;
        
                const artist = document.createElement('p');
                artist.classList.add('card-text');
                artist.textContent = track.artists.map(artist => artist.name).join(', ');
        
                const playButton = document.createElement('button');
                playButton.classList.add('btn', 'btn-success');
                playButton.textContent = 'Play';
                playButton.addEventListener('click', function () {
                    playTrack(track.uri);
                });
        
                cardBody.appendChild(title);
                cardBody.appendChild(artist);
                cardBody.appendChild(playButton);
                card.appendChild(cardBody);
                trackBox.appendChild(card);
        
                return trackBox;
            }
        
            function playTrack(uri) {
                const playerFrame = document.createElement('iframe');
                playerFrame.setAttribute('src', `https://open.spotify.com/embed/track/${uri}`);
                playerFrame.setAttribute('width', '300');
                playerFrame.setAttribute('height', '80');
                playerFrame.setAttribute('frameborder', '0');
                playerFrame.setAttribute('allowtransparency', 'true');
                playerFrame.setAttribute('allow', 'encrypted-media');
        
                playerContainer.innerHTML = '';
                playerContainer.appendChild(playerFrame);
            }
        });
        
