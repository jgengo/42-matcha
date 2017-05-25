module.exports = function (req, res, next)
{
	if (req.session.flash) {
		res.locals.flash = req.session.flash
		req.session.flash = undefined
	}
	if (req.session.toastr) {
		res.locals.toastr = req.session.toastr
		req.session.toastr = undefined
	}

	req.toastr = function(type, content, title) {
		if (req.session.toastr === undefined) {
			req.session.toastr = {}
		}
		req.session.toastr[type] = [content, title]
	}
	req.flash = function(type, content){
		if (req.session.flash === undefined) {
			req.session.flash = {}
		}
		req.session.flash[type] = content
	}
	next()
}