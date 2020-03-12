const request = require('request');
const apiOptions = {
  server: 'http://localhost:3000'
};

const renderHomepage = (req, res, responseBody) => {
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'Error retrieving users';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No user found';
    }
  }
  res.render('users-list',
    {
      title: 'Home Page',
      users: responseBody,
      message: message
    }
  );
};

const homelist = (req, res) => {
  const path = '/api/users';
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {},
  };
  request(
    requestOptions,
    (err, {statusCode}, body) => {
      let data = [];
      if (statusCode === 200 && body.length) {
        console.log('Tingz dey inside!');
      }
      renderHomepage(req, res, body);
    }
  );
};

const getDetailsInfo = (req, res, callback) => {
  const userid = req.params.userid;
  const path = `/api/users/${userid}`
  requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  }

  request(requestOptions, (err, {statusCode}, body) => {
    if (err) { console.log(err) }
    else if (statusCode === 200) {
      callback(req, res, body);
      console.log(`User found: ${statusCode}`);
    }
    else if (statusCode !== 200 || !body.length) { console.log('Error captured:', err)}
  });
}

const createUser = (req, res, callback) => {
  const path = `/api/users`
  requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  }

  request(requestOptions, (err, {statusCode}, body) => {
    if (err) { console.log(err) }
    else if (statusCode === 200) {
      callback(req, res, body);
      console.log(`Page found: ${statusCode}`);
    }
    else if (statusCode !== 200 || !body.length) { console.log('Error captured: ', err)}
  });
}

const renderUserPage = (req, res, userData) => {
  res.render('user-info', {
    title: 'Update Page',
    user: userData,
		error: req.query.err
  });
}

const renderCreateUserPage = (req, res, userData) => {
  res.render('add-user', {
    title: 'Add User',
    user: userData,
    error: req.query.err
  });
}

const userInfo = (req, res) => {
  getDetailsInfo(req, res, (req, res, responseData) => {
    renderUserPage(req, res, responseData);
    console.log('User info works');
  });
}

const newUser = (req, res) => {
  createUser(req, res, (req, res, responseData) => {
    renderCreateUserPage(req,res, responseData);
    console.log('Create user works!');
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
    console.log('first name')
    return res.redirect(`/users/${userid}/?err=val`);
  } else {
    request(requestOptions, (err, {statusCode}, {name}) => {
      if (err) { console.log(err) }
      else if (statusCode === 400 && name && name === 'ValidationError') {
        console.log(`Update failed: ${statusCode}`);
        return res.redirect(`/users/${userid}/?err=val`);
      }
      else {
        console.log(`Update success: ${statusCode}`);
        return res.redirect('/')
      }
    });
  }
}

const deleteUser = (req, res) => {
  const userid = req.params.userid;
  const path = `/api/users/${userid}`;
  const payload = JSON.stringify(userid);
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'DELETE',
    json: {userid},
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Content-Length': Buffer.byteLength(payload)
    // }
  }

  if (!userid) {
    console.log('No Id found');
    return res.redirect(`/users/${userid}/?err=val`);
  }
  else {
    request(requestOptions, (req, {statusCode}, {name}) => {
      if (statusCode !== 200 || (name && name === 'ValidationError')) {
        console.log('Deletion failed');
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

  requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'POST',
    json: queryText
  }

  if (!queryText.first_name) {
    return res.redirect('/users/?err=val')
  } else {
    request(requestOptions, (err, {statusCode}, {name}) => {
      if (err) { console.log('Error ', err) }
      if (statusCode !== 201) {
        return res.redirect('/users/?err=val');
      }
      else {
        console.log('Creation success');
        return res.redirect('/');
      }
    });
  }
}

module.exports = {
  homelist,
  userInfo,
  updateUser,
  newUser,
  forkUser,
  deleteUser
}
