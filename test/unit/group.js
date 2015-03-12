var models = require("../../app/models")
  , Group = models.Group

describe('Group', function() {
  beforeEach(function(done) {
    $database.flushdbAsync()
      .then(function() { done() })
  })

  describe('#create()', function() {
    it('should create without error', function(done) {
      var group = new Group({
        username: 'FriendFeed'
      })

      group.create()
        .then(function(group) {
          group.should.be.an.instanceOf(Group)
          group.should.not.be.empty
          group.should.have.property('id')

          return group
        })
        .then(Group.findById(group.id))
        .then(function(newGroup) {
          newGroup.should.be.an.instanceOf(Group)
          newGroup.should.not.be.empty
          newGroup.should.have.property('id')
          newGroup.id.should.eql(group.id)
          newGroup.should.have.property('type')
          newGroup.type.should.eql('group')
        })
        .then(function() { done() })
    })

    it('should not create with tiny screenName', function(done) {
      var group = new Group({
        username: 'FriendFeed',
        screenName: 'a'
      })

      group.create()
        .catch(function(e) {
          e.message.should.eql("Invalid")
        })
        .then(function() { done() })
    })
  })

  describe('#update()', function() {
    it('should update without error', function(done) {
      var screenName = 'Pepyatka'
      var group = new Group({
        username: 'FriendFeed'
      })

      group.create()
        .then(function(group) {
          group.should.be.an.instanceOf(Group)
          group.should.not.be.empty
          group.should.have.property('id')
          group.should.have.property('screenName')

          return group
        })
        .then(group.update({
          screenName: screenName
        }))
        .then(function(newGroup) {
          newGroup.should.be.an.instanceOf(Group)
          newGroup.should.not.be.empty
          newGroup.should.have.property('id')
          newGroup.id.should.eql(group.id)
          newGroup.should.have.property('type')
          newGroup.type.should.eql('group')
          group.should.have.property('screenName')
          newGroup.screenName.should.eql(screenName)
        })
        .then(function() { done() })
    })

    it('should update without screenName', function(done) {
      var screenName = 'Luna'
      var group = new Group({
        username: 'Luna',
        screenName: screenName
      })

      group.create()
        .then(function(group) {
          return group.update({})
        })
        .then(function(newGroup) {
          newGroup.should.be.an.instanceOf(Group)
          newGroup.should.not.be.empty
          newGroup.should.have.property('id')
          newGroup.screenName.should.eql(screenName)
        })
        .then(function() { done() })
    })
  })
})