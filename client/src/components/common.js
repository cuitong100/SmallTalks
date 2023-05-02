const baseEnvUrl = process.env.REACT_APP_API_URL;

export function fetchData(url, options) {
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
}

export function getRecordUrl(suffix='') {
    const baseUrl = `${baseEnvUrl}/records`;
    return baseUrl + suffix;
}

export function getOptions(method='GET', data={}) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    }
    if (method != 'GET') {
        options.body = JSON.stringify(data);
    }
    return options;
}

export function createNewTalk({ title, content, authorId, callback }) {
    fetchData(getRecordUrl(``), getOptions('POST', {
        title: title,
        content: content,
        authorId: authorId
    }))
    .then(data => {
        console.log(data);
        if (callback) {
            callback();
        }
    })
    .catch(error => console.error(error));   
}

export function getAllTalks(setTalks) {
    fetchData(getRecordUrl(``), getOptions('GET'))
    .then(data => {
        console.log(data);
        if (setTalks) {
            setTalks(data);
        }
    })
    .catch(error => console.error(error));
}

export function getAllTalksCreatedBy(setTalks, userId) {
    fetchData(getRecordUrl(`/ofuser/${userId}`), getOptions('GET'))
    .then(data => {
        console.log(data);
        if (setTalks) {
            setTalks(data);
        }
    })
    .catch(error => console.error(error));
}

export async function likeButtonClickedFor({userId, recordId}) {
    const res = await fetchData(`${baseEnvUrl}/likes`, getOptions('POST', {
        userId: userId,
        recordId: recordId,
    }));
    return res;
}

export async function getLikesById({recordId}) {
    const likes = await fetchData(`${baseEnvUrl}/likes/${recordId}`, getOptions('GET'));
    return likes;
}

export async function getLikedTalks(setTalks, {userId}) {
    const likedTalks = await fetchData(getRecordUrl(`/likedbyuser/${userId}`), getOptions('GET'));
    setTalks(likedTalks);
}

export async function getDetailTalk({recordId}) {
    const detailTalk = await fetchData(getRecordUrl(`/${recordId}`), getOptions('GET'));
    return detailTalk;
}

export async function updateTalk({recordId, title, content}) {
    const updateResult = await fetchData(getRecordUrl(`/${recordId}`), getOptions('PUT', {
        title, content
    }));
    return updateResult;
}

export async function deleteTalk({recordId}) {
    const delResult = await fetchData(getRecordUrl(`/${recordId}`), getOptions('DELETE'));
    return delResult;
}

export async function getUserIntIdAuth({getAccessTokenSilently}) {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${baseEnvUrl}/user`,{
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });
    return response;
}

// userintid
export async function getUserIntId({sub}) {
    const response = await fetchData(`${baseEnvUrl}/simpleuser`, getOptions('POST', {
        sub
    }));
    return parseInt(response.id);
}

// username
export async function getUserName({sub}) {
    const response = await fetchData(`${baseEnvUrl}/simpleuser`, getOptions('POST', {
        sub
    }));
    return response.username;
}