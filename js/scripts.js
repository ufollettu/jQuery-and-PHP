const Actors = {
    init: function (config) {
        this.config = config;

        this.setupTemplates();
        this.bindEvents();

        $.ajaxSetup({ // setup for all the ajax method
            url: 'index.php',
            type: 'POST'
        });

        $('button').remove(); // little lazy
    },

    bindEvents: function () { // bind events with methods created
        this.config.letterSelection.on('change', this.fetchActors);
        this.config.actorsList.on('click', 'li', this.displayAuthorInfo);
        this.config.actorInfo.on('click', 'span.close', this.closeOverlay);
    },

    setupTemplates: function () {
        this.config.actorListTemplate = Handlebars.compile(this.config.actorListTemplate);
        this.config.actorInfoTemplate = Handlebars.compile(this.config.actorInfoTemplate);

        Handlebars.registerHelper('fullName', function (actor) {
            return actor.first_name + ' ' + actor.last_name;
        });
    },

    fetchActors: function () { // when user make a browser request, retrieve data from DB
        const self = Actors;

        $.ajax({
            data: self.config.form.serialize(), // what are we sending throught
            dataType: 'json',
            success: function (results) {
                self.config.actorsList.empty(); // empty previous results
                // take the results from DB
                if (results[0]) {
                    self.config.actorsList.append(self.config.actorListTemplate(results));
                } else {
                    self.config.actorsList.append('<li>Nothing returned.</li>');
                }
            }
        });
    },

    displayAuthorInfo: function (e) {
        const self = Actors;

        self.config.actorInfo.slideUp(300);

        $.ajax({
            data: {actor_id: $(this).data('actor_id')}
        }).then(function (results) {
            self.config.actorInfo.html(self.config.actorInfoTemplate({info: results})).slideDown(300);
        });

        e.preventDefault();
    },

    closeOverlay: function () {
        Actors.config.actorInfo.slideUp(300);
    }
};

Actors.init({
    letterSelection: $('#q'),
    form: $('#actor-selection'),
    actorListTemplate: $('#actor_list_template').html(),
    actorInfoTemplate: $('#actor_info_template').html(),
    actorsList: $('ul.actors_list'),
    actorInfo: $('div.actor_info')
});




