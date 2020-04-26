const request = require('request');
const apiOptions = { server: `http://localhost:${process.env.PORT}` };

/* Get 'home page' */
const renderHomepage = (req, res, responseBody, total, pageNo) => {
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No users found';
    }
  }

	res.render('users-list', {
    title: 'Home Page',
    users: responseBody,
    pageTotal: total,
    current: pageNo,
    message: message
	});
}

const homelist = (req, res) => {
  const data = req.query.pageNo;
  const pageNo = (typeof data === 'undefined' || data < 1) ? 1 : parseInt(data);
  const path = `/api/users?pageNo=${pageNo}`;
	const requestOptions = {
		url: `${apiOptions.server}${path}`,
		method: 'GET',
		json: {},
  };

  request(
    requestOptions, (err, {statusCode}, body) => {
      if (err) {
        console.log('There was an error ', err);
        return res.status(400).json({error: err});
      } else if (statusCode === 200 ) {
        renderHomepage(req, res, body.status, body.total, body.pageNo);
      } else {
        console.log('error ', statusCode);
        return res.status(400).send(body);
      }
    }
  );
}

const getDetailsInfo = (req, res, callback) => {
  const userid = req.params.userid;
  const path = `/api/users/${userid}`
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  }

  request(requestOptions, (err, {statusCode}, body) => {
    if (err) {
      console.log(err);
      return res.status(400).json({error: err});
    }
    else if (statusCode === 200) {
      callback(req, res, body);
      console.log(`User found: ${statusCode}`);
    }
    else {
      showError(req, res, statusCode);
      console.log('Error captured:', err);
    }
  });
}

const renderUserPage = (req, res, userData) => {
  res.render('user-info', {
    title: 'Update Page',
    user: userData,
    error: req.query.err
  });
}


/* Get 'User info' page */
const userInfo = (req, res) => {
	getDetailsInfo(req, res, (req, res, responseData) => {
		renderUserPage(req, res, responseData);
  });
};


const createUserPage = (req, res, callback) => {
  const path = `/api/users`
  const  requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  }

  request(requestOptions, (err, {statusCode}, body) => {
    if (err) {
      console.log('Error: ', err);
      return res.status(400).json({error: err});
    }
    else if (statusCode === 200) {
      callback(req, res, body);
      console.log(`Page found: ${statusCode}`);
    }
    else if (statusCode !== 200 || !body.length) {
      console.log('Error captured: ', err);
      showError(req, res, statusCode);
    }
  });
}

const renderCreateUserPage = (req, res, userData) => {
  res.render('add-user', {
    title: 'Add User',
    user: userData,
    error: req.query.err
  });
}

const newUser = (req, res) => {
  createUserPage(req, res, (req, res, responseData) => {
    renderCreateUserPage(req,res, responseData);
  })
}

const updateUser = (req, res) => {
  const userid = req.params.userid;
  const path = `/api/users/${userid}`

  const { first_name, last_name, email, gender, ip_address } = req.body;
  const queryText = { first_name, last_name, email, gender, ip_address };

  const requestOptions = {
		url: `${apiOptions.server}${path}`,
		method: 'PUT',
		json: queryText
	};

  if (!queryText.first_name  || !queryText.last_name || !queryText.email
      || !queryText.gender || !queryText.ip_address) {
    return res.redirect(`/users/${userid}/?err=val`);
  } else {
    request(requestOptions, (err, {statusCode}, {name}) => {
      if (err) {
        console.log(err);
        return res.status(400).json({error: err});
      }
      if (statusCode === 200) {
        console.log(`Update success: ${statusCode}`);
        return res.redirect('/');
      }
      else if (statusCode !== 200 && name && name === 'ValidationError') {
        console.log(`Update failed: ${statusCode}`);
        return res.redirect(`/users/${userid}/?err=val`);
      } else {
        console.log('Update error');
        return res.redirect(`/users/${userid}/?error`);
      }
    });
  }
}

const deleteUser = (req, res) => {
  const userid = req.params.userid;
  const path = `/api/users/${userid}`;
  // const payload = JSON.stringify(userid);
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'DELETE',
    json: {userid},
  }

  if (!userid) {
    console.log('No Id found');
    return res.redirect(`/users/${userid}/?err=val`);
  }
  else {
    request(requestOptions, (err, {statusCode}, {name}) => {
      if (err) {
        console.log(err);
        return res.status(400).json({error: err});
      }
      if (statusCode !== 200 || (name && name === 'ValidationError')) {
        console.log('Deletion failed');
        return res.redirect(`/users/${userid}/?err=val`);
      } else {
        console.log('Deletion success!');
        return res.redirect(`/`);
      }
    });
  }
}

const forkUser = (req, res) => {
  const { first_name, last_name, email, gender, ip_address } = req.body;
  const queryText = { first_name, last_name, email, gender, ip_address };
  const path = '/api/users';

  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'POST',
    json: queryText
  }

  if (!queryText.first_name || !queryText.last_name || !queryText.email
       || !queryText.gender || !queryText.ip_address) {
    return res.redirect('/users/?err=val')
  } else {
    request(requestOptions, (err, {statusCode}, {name}) => {
      if (err) { console.log('Error ', err) }
      if (statusCode !== 201 || (name && name === 'ValidationError')) {
        // console.log('Error is', err)
        return res.redirect(`/users/?err=val`);
      }
      else {
        console.log('Creation success');
        return res.redirect('/');
      }
    });
  }
}

const showError = (req, res, status) => {
  let title, content;
	if (status === 404) {
		title = status + ': page not found';
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	res.status(status);
	res.render('show-error', {
		title: title,
		content: content
	});
}


module.exports = {
  homelist,
  userInfo,
  updateUser,
  newUser,
  forkUser,
  deleteUser
}
