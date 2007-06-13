# This file is autogenerated. Instead of editing this file, please use the
# migrations feature of ActiveRecord to incrementally modify your database, and
# then regenerate this schema definition.

ActiveRecord::Schema.define(:version => 50) do

  create_table "constraints", :force => true do |t|
    t.column "search_id", :integer
    t.column "inverted",  :boolean
    t.column "type",      :string
    t.column "field",     :string
    t.column "value",     :string
  end

  create_table "contributors", :force => true do |t|
    t.column "archive_name", :string, :default => "", :null => false
    t.column "email",        :string, :default => "", :null => false
    t.column "contact",      :string, :default => "", :null => false
  end

  create_table "exhibit_page_types", :force => true do |t|
    t.column "name",            :string
    t.column "description",     :string
    t.column "template",        :string
    t.column "min_sections",    :integer
    t.column "max_sections",    :integer
    t.column "exhibit_type_id", :integer
  end

  create_table "exhibit_section_types", :force => true do |t|
    t.column "description",          :string
    t.column "template",             :string
    t.column "name",                 :string
    t.column "exhibit_page_type_id", :integer
  end

  create_table "exhibit_section_types_exhibit_types", :id => false, :force => true do |t|
    t.column "exhibit_type_id",         :integer
    t.column "exhibit_section_type_id", :integer
  end

  create_table "exhibit_types", :force => true do |t|
    t.column "description", :string
    t.column "template",    :text
  end

  create_table "exhibited_pages", :force => true do |t|
    t.column "exhibit_id",           :integer
    t.column "exhibit_page_type_id", :integer
    t.column "position",             :integer
    t.column "title",                :string
    t.column "annotation",           :string
  end

  create_table "exhibited_resources", :force => true do |t|
    t.column "exhibited_section_id", :integer, :null => false
    t.column "citation",             :string
    t.column "annotation",           :text
    t.column "position",             :integer
    t.column "uri",                  :string
  end

  create_table "exhibited_sections", :force => true do |t|
    t.column "exhibited_page_id",       :integer
    t.column "exhibit_section_type_id", :integer, :null => false
    t.column "position",                :integer
    t.column "title",                   :string
    t.column "annotation",              :text
  end

  create_table "exhibits", :force => true do |t|
    t.column "user_id",         :integer
    t.column "license_id",      :integer
    t.column "title",           :string
    t.column "exhibit_type_id", :integer
    t.column "annotation",      :text
    t.column "shared",          :boolean, :default => false
    t.column "published",       :boolean, :default => false
  end

  create_table "facet_categories", :force => true do |t|
    t.column "parent_id", :integer
    t.column "value",     :string
    t.column "type",      :string
  end

  create_table "interpretations", :force => true do |t|
    t.column "user_id",    :integer
    t.column "object_uri", :string,   :limit => 512
    t.column "annotation", :text
    t.column "created_on", :datetime
    t.column "updated_on", :datetime
  end

  create_table "licenses", :force => true do |t|
    t.column "description", :string
  end

  create_table "roles", :force => true do |t|
    t.column "name", :string
  end

  create_table "roles_users", :id => false, :force => true do |t|
    t.column "role_id", :integer
    t.column "user_id", :integer
  end

  create_table "searches", :force => true do |t|
    t.column "name",    :string
    t.column "user_id", :integer
  end

  create_table "sessions", :force => true do |t|
    t.column "session_id", :string
    t.column "data",       :text
    t.column "updated_at", :datetime
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "sites", :force => true do |t|
    t.column "code",        :string
    t.column "url",         :string
    t.column "description", :string
    t.column "thumbnail",   :string
  end

  create_table "taggings", :force => true do |t|
    t.column "tag_id",            :integer
    t.column "interpretation_id", :integer
    t.column "created_on",        :datetime
  end

  create_table "tags", :force => true do |t|
    t.column "name",       :string,   :default => "", :null => false
    t.column "created_on", :datetime
  end

  add_index "tags", ["name"], :name => "tags_name", :unique => true

  create_table "users", :force => true do |t|
    t.column "username",      :string
    t.column "password_hash", :string
    t.column "fullname",      :string
    t.column "email",         :string
    t.column "isEditor",      :boolean
  end

end
